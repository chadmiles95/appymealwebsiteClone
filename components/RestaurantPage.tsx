import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Spacer } from "./Spacer";
import Image from "next/image";
import { PopupModal } from "./PopupModal";
import { useSelector } from "react-redux";
import useUpdateTime from "../redux/useUpdateTime";
import { useRouter } from "next/router";
import { PopupModalNew } from "./PopupModalNew";

interface MenuItemProps {
  name: string;
  description: string;
  price: number;
}

interface RestaurantPageProps {
  restaurant: any; // You can replace 'any' with the appropriate type for a restaurant
}

export const RestaurantPage: React.FC<RestaurantPageProps> = ({
  restaurant,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemProps>();
  const [currentlyOpen, setCurrentlyOpen] = useState<boolean>(false);

  //   GET LAST PAGE URL FOR BACK BUTTON
  const lastURL = useSelector((state: any) => state.shopper.lastVisitedPage);
  const router = useRouter();

  //   GET THE CURRENT TIME AND UPDATES IT IN REDUX
  const militaryTime = useSelector((state: any) => state.shopper.militaryTime);
  const updateTime = useUpdateTime();

  //   SET RESTAURNAT OPEN/CLOSED DEPENDING ON TIME, MENU & MASTER TOGGLE
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
  }, [militaryTime, restaurant]);

  const handleMenuItemClick = (item: MenuItemProps) => {
    setSelectedMenuItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedMenuItem(undefined);
    setModalOpen(false);
  };

  const handleBackButtonClick = () => {
    if (lastURL) {
      router.push(lastURL);
    } else {
      // If there's no last visited page, navigate to a default page or handle this case as needed
      router.push("/");
    }
  };

  //   console.log(restaurant.menus.burgers[0]);

  return (
    <div className="w-full h-full flex-1">
      <div className="w-full lg:h-10 bg-white justify-center items-center flex flex-row flex-wrap lg:flex-nowrap">
        <div className="w-full justify-start px-10 basis-full lg:flx-basis-1/4 py-2 lg:py-0">
          <p
            onClick={() => {
              handleBackButtonClick();
            }}
            className="font-semibold  hover:text-lightdark duration-200  cursor-pointer text-dark w-10"
          >
            Back
          </p>
        </div>
        <p className="font-semibold px-8 text-dark basis-full lg:flx-basis-1/4 py-2 lg:py-0">
          Rewards & Discounts On App:
        </p>
        <Link href="https://apps.apple.com/us/app/appymeal/id6443683011" className="basis-full lg:flx-basis-1/4 py-2 lg:py-0">
          <p className="font-semibold px-8 hover:text-lightdark duration-200 cursor-pointer text-dark">
            Download iOS Now
          </p>
        </Link>
        <Link href="https://play.google.com/store/apps/details?id=com.zowen1.AppyMeal&hl=en_US&gl=US" className="basis-full lg:flx-basis-1/4 py-2 lg:py-0">
          <p className="font-semibold px-8 hover:text-lightdark duration-200 cursor-pointer text-dark">
            Download Android Now
          </p>
        </Link>
      </div>
      {/* TOP NAVBAR FOR RESTAURANTS */}
      <div className="bg-smoke w-full h-40  items-center flex pg-4 gap-2  px-4 lg:px-16 justify-between">
        <div className="flex items-center">
          <div className="justify-start">
            <Image
              src={restaurant.photo}
              width={125}
              height={125}
              alt="restaurantLogo"
              className="object-cover rounded-xl"
            />
          </div>
          <div className="justify-start pl-8 ">
            <p className="text-2xl font-semibold text-dark">
              {restaurant.name}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start">
          <p className="text-dark">
            {restaurant.address} {restaurant.city}, {restaurant.state}
          </p>
          <p className="text-dark">Hours - 11:00 AM - 8:00 PM</p>
          <p className="text-dark">Status - Open</p>
        </div>
      </div>
      <div className="w-full h-full flex flex-row flex-wrap lg:flex-nowrap  py-12 ">
        <div className="basis-full lg:basis-2/3 lg:flex-1 flex-auto flex flex-col  px-4 lg:px-16">
          <p className="text-dark">{restaurant.desc}</p>
          {/* restaurant photos extra */}
          <div className="mt-12 flex flex-row w-full flex-wrap xl:flex-nowrap">
            {restaurant.images.map((image: string) => {
              return (
                <div
                  key={image.substring(15)}
                  className="basis-full flex justify-center my-2 md:basis-1/2 xl:basis-1/3 h-80 lg:h-60 overflow-hidden"
                >
                  <div className="rounded-xl overflow-hidden h-80 lg:h-60 mx-4">
                    <Image
                      src={image}
                      width={300}
                      height={60}
                      alt="restaurantLogo"
                      className="rounded-xl object-cover h-full overflow-hidden  hover:scale-105 "
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {/* MENU ITEMS START */}
          {Object.entries(restaurant.menus)
            .filter(([category]) => category !== "properties")
            .map(([category, items]) => (
              <div key={category} className="w-full mt-12 flex flex-col">
                <p className="font-semibold text-xl text-dark mb-6">
                  {category}
                </p>
                <div className="py-6 px-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {items.map((item: any) => (
                    <div
                      key={item.name}
                      onClick={() => handleMenuItemClick(item)}
                      className="flex flex-col w-full border border-lightdark border-solid h-32 rounded-xl bg-white px-4 py-2 hover:bg-smoke cursor-pointer duration-300"
                    >
                      <div className="h-1/4">
                        <p className="text-dark">{item.name}</p>
                      </div>
                      <div className="h-2/4 py-1">
                        <p className="text-dark text-sm">
                          {item.desc.length > 90
                            ? item.desc.substring(0, 90) + "..."
                            : item.desc}
                        </p>
                      </div>
                      <div className="h-1/4">
                        <p className="text-dark">
                          $
                          {new Intl.NumberFormat("en-US", {
                            style: "decimal",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          {/* <div className="w-full mt-12 flex flex-col"> */}
          {/* <p className="font-semibold text-xl text-dark mb-6">Burgers</p>
            <div className="py-6 px-4 grid grid-cols-2 gap-4">
              <div
                onClick={() =>
                  handleMenuItemClick({
                    name: "Burger 1",
                    description:
                      "The best burger in the world that you have ever had by far",
                    price: 11.99,
                  })
                }
                className="flex flex-col w-full border border-lightdark border-solid h-32 rounded-xl bg-white px-4 py-2 hover:bg-smoke cursor-pointer duration-300"
              >
                <div className="h-1/4">
                  <p className="text-dark">Burger 1</p>
                </div>
                <div className="h-2/4 py-1">
                  <p className="text-dark text-sm">
                    The best burger in the world that you have ever had by far
                  </p>
                </div>
                <div className="h-1/4">
                  <p className="text-dark">$13.99</p>
                </div>
              </div>
              <div className="flex flex-col w-full  border border-lightdark border-solid h-32 rounded-xl bg-white px-4 py-2 hover:bg-smoke cursor-pointer duration-300">
                <div className="h-1/4">
                  <p className="text-dark">Burger 1</p>
                </div>
                <div className="h-2/4 py-1">
                  <p className="text-dark text-sm">
                    The best burger in the world that you have ever had by far
                  </p>
                </div>
                <div className="h-1/4">
                  <p className="text-dark">$13.99</p>
                </div>
              </div>
              <div className="flex flex-col w-full border border-lightdark border-solid h-32 rounded-xl bg-white px-4 py-2 hover:bg-smoke cursor-pointer duration-300">
                <div className="h-1/4">
                  <p className="text-dark">Burger 1</p>
                </div>
                <div className="h-2/4 py-1">
                  <p className="text-dark text-sm">
                    The best burger in the world that you have ever had by far
                  </p>
                </div>
                <div className="h-1/4">
                  <p className="text-dark">$13.99</p>
                </div>
              </div>
              <div className="flex flex-col w-full border border-lightdark border-solid h-32 rounded-xl bg-white px-4 py-2 hover:bg-smoke cursor-pointer duration-300">
                <div className="h-1/4">
                  <p className="text-dark">Burger 1</p>
                </div>
                <div className="h-2/4 py-1">
                  <p className="text-dark text-sm">
                    The best burger in the world that you have ever had by far
                  </p>
                </div>
                <div className="h-1/4">
                  <p className="text-dark">$13.99</p>
                </div>
              </div>
            </div> */}
          {/* </div> */}
        </div>
        <div className="basis-full lg:basis-1/3 lg:flex-1 flex-auto flex flex-col mx-auto px-4 lg:px-16 items-center">
          <p className="text-xl font-semibold text-dark">Methods Available</p>
          <div className="w-full flex flex-row gap-2 justify-center items-center mt-4">
            <div className="flex flex-row gap-8">
              <div className="flex bg-primary w-36 h-auto justify-center items-center rounded-full py-1">
                <p className="text-white text-xl">Pickup</p>
              </div>

              {restaurant.enableDelivery && (
                <div className="flex bg-primary w-36 h-auto justify-center items-center rounded-full py-1">
                  <p className="text-white text-xl">Delivery</p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-8  border-lightdark border-solid border rounded-xl w-full items-center">
            <div className="px-8 py-2 border-b border-lightdark border-solid border-1">
              <p className="font-semibold text-dark">Current Cart</p>
            </div>
            <div className="px-8 py-2">
              <p className="text-dark">Restaurant: Sam`s On Main</p>
              <div className="px-2 py-2">
                <div className="justify-between flex flex-row pb-2">
                  <p className=" underline underline-offset-2 decoration-dark decoration-1">
                    Items
                  </p>
                  <p className="underline underline-offset-2 decoration-dark decoration-1">
                    Price
                  </p>
                </div>
                <div className="justify-between flex flex-row pb-1">
                  <p className="text-dark">Burger</p>
                  <p className="text-dark">$12.98</p>
                </div>
                {/* <div className="justify-between flex flex-row pb-1 pt-8"> */}
                <Link
                  href="/cart"
                  className="justify-between flex flex-row pb-1 pt-8"
                >
                  <button className="bg-primary hover:bg-muted w-full text-white h-10 rounded-full font-semibold duration-300">
                    Checkout
                  </button>
                </Link>
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedMenuItem && (
        <PopupModalNew
          isOpen={modalOpen}
          closeModal={handleCloseModal}
          item={selectedMenuItem}
        />
      )}
    </div>
  );
};
