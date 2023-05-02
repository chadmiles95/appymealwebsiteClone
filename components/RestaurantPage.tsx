import Link from "next/link";
import React from "react";
import { Spacer } from "./Spacer";
import Image from "next/image";

interface RestaurantPageProps {
  restaurant: any; // You can replace 'any' with the appropriate type for a restaurant
}

export const RestaurantPage: React.FC<RestaurantPageProps> = ({
  restaurant,
}) => {
  return (
    <div className="w-full h-full ">
      <div className="w-full h-10 bg-white  justify-center items-center flex">
        <p className="font-semibold  px-8 text-dark">
          Rewards & Discounts On App:
        </p>
        <Link href="https://apps.apple.com/us/app/appymeal/id6443683011">
          <p className="font-semibold  hover:text-lightdark duration-200  cursor-pointer text-dark">
            Download iOS Now
          </p>
        </Link>
        <Link href="https://play.google.com/store/apps/details?id=com.zowen1.AppyMeal&hl=en_US&gl=US">
          <p className="font-semibold px-8 hover:text-lightdark duration-200 cursor-pointer text-dark">
            Download Android Now
          </p>
        </Link>
      </div>
      {/* TOP NAVBAR FOR RESTAURANTS */}
      <div className="bg-smoke w-full h-40  items-center flex px-16 justify-between">
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
            <p className="text-xl font-semibold text-dark">{restaurant.name}</p>
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
      <div className="w-full h-full flex py-12 ">
        <div className="w-2/3 flex flex-col  px-16">
          <p className="text-dark">{restaurant.desc}</p>
          {/* restaurant photos extra */}
          <div className="mt-12 flex flex-row w-full">
            {restaurant.images.map((image: string) => {
              return (
                <div
                  key={image.substring(15)}
                  className="w-1/3 h-60 overflow-hidden"
                >
                  <div className="rounded-xl overflow-hidden h-60 mx-4">
                    <Image
                      src={image}
                      width={250}
                      height={60}
                      alt="restaurantLogo"
                      className="object-cover h-full overflow-hidden  hover:scale-105 "
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {/* MENU ITEMS START */}
          <div className="w-full mt-20 flex flex-col">
            <p className="font-semibold text-xl text-dark mb-8">Burgers</p>
            <div className="py-6 px-4 grid grid-cols-2 gap-4">
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
            </div>
          </div>
        </div>
        <div className="w-1/3 flex flex-col px-16 items-center">
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
          <div className="mt-8  border-dark border-solid border-2 rounded-xl w-full items-center">
            <div className="px-8 py-2 border-b border-dark border-solid border-1">
              <p className="font-semibold text-dark">Current Cart</p>
            </div>
            <div className="px-8 py-2">
              <p className="text-dark">Restaurant: Sam's On Main</p>
              <div className="px-2 py-2">
                <div className="justify-between flex flex-row pb-2">
                  <p className="font-semibold underline underline-offset-2">
                    Items
                  </p>
                  <p className="font-semibold underline underline-offset-2">
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
    </div>
  );
};
