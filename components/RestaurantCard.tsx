import Image from "next/image";
import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";

const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const isSchemaHoursOpen = (hoursSchema: string[]) => {
  const now = new Date();
  const today = days[now.getUTCDay()];
  const todaysSchema = hoursSchema?.find((row) => {
      row.includes(today);
  });
  if (!todaysSchema) { return false; }
  const schemaSplit = todaysSchema.split(' ');
  const ranges = schemaSplit[1].trim().split(',');
  return ranges.some((range) => {
      const rangeSplit = range.split('-');
      const openMilitaryTime = Number(rangeSplit[0].trim());
      const closeMilitaryTime = Number(rangeSplit[1].trim());
      const nowMilitaryTime = Number(`${now.getUTCHours()}${now.getUTCMinutes()}`);
      return nowMilitaryTime > openMilitaryTime && nowMilitaryTime < closeMilitaryTime;
  });
}

export const isRestaurantHours = (currentMilitaryTime: string, restaurant: {
  hours?: string;
  opening_hours?: {
      store_hours: {
          schema: string[];
          timezone: 'UTC';
      };
  };
}): boolean => {
  if (restaurant.opening_hours) {
      return isSchemaHoursOpen(restaurant.opening_hours.store_hours?.schema);
  }

  // Backwards compatible for Firebase
  return parseFloat(currentMilitaryTime) > parseFloat(restaurant?.hours?.substring(0, 4) || '0')
      && parseFloat(currentMilitaryTime) < parseFloat(restaurant?.hours?.substring(5, 9) || '0');
}

export const isMenuHours = (currentMilitaryTime: string, menuHours?: string, menu_hours?: {
  [key: string]: {
      schema: string[];
      timezone: 'UTC';
      enable_active: boolean;
  }
}): boolean => {
  // Backwards compatible for Firebase
  if (menuHours === "All Day") {
      return true;
  }

  if (menu_hours) {
      return Object.keys(menu_hours).some((key) => {
          if (!menu_hours[key].enable_active) {
              return false;
          }
          return isSchemaHoursOpen(menu_hours[key]?.schema);
      })
  }

  // Backwards compatible for Firebase
  return parseFloat(currentMilitaryTime) > parseFloat(menuHours?.substring(0, 4) || '0')
      && parseFloat(currentMilitaryTime) < parseFloat(menuHours?.substring(5, 9) || '0')
}

export const isRestaurantAndMenuOpen = (currentMilitaryTime: string, restaurant: {
  // Old format
  hours?: any;
  isOpen?: boolean;
  menuStatus?: any;
  menuHours?: any;
  // New Format
  enable_open?: boolean;
  opening_hours?: {
      menu_hours?: {
          [key: string]: {
              schema: string[];
              timezone: 'UTC';
              enable_active: boolean;
          }
      };
      store_hours: {
          schema: string[];
          timezone: 'UTC';
      };
  };
}): boolean => {
  // Backwards compatibility for Firebase/Postges data
  const isOpen = restaurant?.isOpen || restaurant?.enable_open;

  if (!isOpen) {
      return false;
  }

  // Backwards compatible for Firebase
  if (
      (typeof restaurant.hours === "undefined" || restaurant?.menuStatus === false)
      && !restaurant.opening_hours
  ) {
      return false;
  }

  return isRestaurantHours(currentMilitaryTime, restaurant)
      && isMenuHours(currentMilitaryTime, restaurant.menuHours, restaurant?.opening_hours?.menu_hours);
}

const RestaurantCard = ({ restaurant, updateTime }: any) => {
  const [currentlyOpen, setCurrentlyOpen] = useState(false);
  const currentTime = useSelector((state: any) => state.shopper.currentTime);
  const militaryTime = useSelector((state: any) => state.shopper.militaryTime);
  const router = useRouter();

  useEffect(() => {
    updateTime();
    //can't add to depen array - infinite loop
  }, []);

  useEffect(() => {
    const isRestOpen = isRestaurantAndMenuOpen(militaryTime, restaurant);
    setCurrentlyOpen(isRestOpen);
  }, [
    restaurant.hours,
    militaryTime,
    restaurant.isOpen,
    restaurant.menuStatus,
    restaurant,
  ]);

  return (
    <div
      key={restaurant.name}
      className="border-[1px] min-w-[335px] max-w-[335px] min-h-[390px] max-h-[390px] border-gray-200 mb-2 group shadow-md rounded-xl cursor-pointer"
      onClick={() => {
        router.push(`restaurants/${restaurant.name}`);
      }}
    >
      <div className="w-full h-64 overflow-hidden rounded-xl">
        <Image
          className="w-full h-full object-cover group-hover:scale-105 rounded-xl"
          width={200}
          height={300}
          src={restaurant.photo}
          alt="itemImage"
        />
      </div>
      {/* Description */}
      <div className="px-2 py-0 flex flex-col justify-between">
        <div className="flex justify-between pt-3 pb-2">
          <div className="max-w-[235px]">
            <p className="text-lg font-semibold text-ellipsis">
              {restaurant.name}
            </p>
            <p className="pt-0 mt-0 text-ellipsis">{restaurant.address || restaurant.address_line_1}</p>
            <p className="pt-0 mt-0">
              {restaurant.city || restaurant.address_city}, {restaurant.state || restaurant.address_state_province_id}
            </p>
          </div>
          <Link
            href={{
              pathname: `restaurants/${restaurant.name}`,
            }}
            as={`restaurants/${restaurant.name}`}
          >
            <button
              onClick={
                () => null
                //go to individual restaurant page
              }
              className="  w-20 h-9 bg-text bg-white text-dark rounded-full flex gap-1 items-center justify-center hover:bg-lightdark duration-300 shadow-md"
            >
              <span>
                <GoPlus />
              </span>
              Menu
            </button>
          </Link>
        </div>
      </div>
      <div className=" w-full flex flex-row gap-2 justify-between px-2">
        <div className="flex flex-row gap-2">
          <div className="flex bg-primary w-16 h-auto justify-center items-center rounded-xl">
            <p className="text-white">Pickup</p>
          </div>

          {(restaurant.enableDelivery || restaurant.enable_delivery) && (
            <div className="flex bg-primary w-20 h-auto justify-center items-center rounded-xl">
              <p className="text-white">Delivery</p>
            </div>
          )}
        </div>
        {currentlyOpen && (
          <div className="flex bg-primary w-16 h-auto justify-center items-center rounded-xl">
            <p className="text-white">OPEN</p>
          </div>
        )}
        {!currentlyOpen && (
          <div className="flex bg-white w-20 h-auto justify-center items-center rounded-xl">
            <p className="text-dark">CLOSED</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantCard;
