import Image from "next/image";
import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { useSelector } from "react-redux";
import useUpdateTime from "../redux/useUpdateTime";
import Link from "next/link";

const RestaurantCard = ({ restaurant }: any) => {
  const [currentlyOpen, setCurrentlyOpen] = useState(false);
  const currentTime = useSelector((state: any) => state.shopper.currentTime);
  const militaryTime = useSelector((state: any) => state.shopper.militaryTime);
  const updateTime = useUpdateTime();

  console.log("militaryTime", militaryTime);
  console.log("currentTime", currentTime);

  useEffect(() => {
    updateTime();
  }, []);

  useEffect(() => {
    if (
      typeof restaurant.hours === "undefined" ||
      restaurant?.menuStatus === false
    ) {
      setCurrentlyOpen(false);
    } else if (
      parseFloat(militaryTime) >
        parseFloat(restaurant?.hours?.substring(0, 4)) &&
      parseFloat(militaryTime) <
        parseFloat(restaurant?.hours?.substring(5, 9)) &&
      restaurant.isOpen === true &&
      (parseFloat(militaryTime) >
        parseFloat(restaurant?.menuHours?.substring(0, 4)) ||
        restaurant?.menuHours === "All Day") &&
      (parseFloat(militaryTime) <
        parseFloat(restaurant?.menuHours?.substring(5, 9)) ||
        restaurant?.menuHours === "All Day")
    ) {
      setCurrentlyOpen(true);
    } else {
      setCurrentlyOpen(false);
    }
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
      className="border-[1px] w-full h-full border-gray-200 mb-2 group shadow-md rounded-xl"
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
      <div className="px-2 py-0 flex flex-col  justify-center">
        <div className="flex justify-between pt-3 pb-2">
          <div>
            <p className="text-lg font-semibold">
              {restaurant.name.substring(0, 25)}
            </p>
            <p className="pt-0 mt-0">{restaurant.address}</p>
            <p className="pt-0 mt-0">
              {restaurant.city}, {restaurant.state}
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
          {/* <Link
                    href={{
                      pathname: `restaurants/${restaurant.name}`,
                      query: {
                        name: restaurant.name,
                        description: restaurant.desc,
                        photo: restaurant.photo,
                      },
                    }}
                    as={`restaurants/${restaurant.name}`}
                  >
                    <button className="w-24 h-9 bg-white border-[1px] border-black text-black   rounded-full flex items-center justify-center gap-1 hover:bg-secondary hover:text-white duration-300">
                      Details
                    </button>
                  </Link> */}
        </div>
        <div className="w-full flex flex-row gap-2 justify-between">
          <div className="flex flex-row gap-2">
            <div className="flex bg-primary w-16 h-auto justify-center items-center rounded-xl">
              <p className="text-white">Pickup</p>
            </div>

            {restaurant.enableDelivery && (
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
          {/* <p>CLOSED</p> */}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
