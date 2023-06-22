import React from "react";
import CartPageComponent from "../components/CartPageComponent";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import HourDisplay from "@/components/HoursDisplay";
import OpenStatus from "@/components/OpenStatus";

const Cart = () => {
  const lastURL = useSelector((state: any) => state.shopper.lastVisitedPage);
  const rest = useSelector((state: any) => state.shopper.currentRestaurant);
  const militaryTime = useSelector((state: any) => state.shopper.militaryTime);
  const router = useRouter();

  const handleBackButtonClick = () => {
    if (lastURL) {
      router.push(lastURL);
    } else {
      // If there's no last visited page, navigate to a default page or handle this case as needed
      router.push("/restaurants");
    }
  };

  return (
    <div className="w-full h-full flex-1">
      <div className="w-full h-12 lg:h-14 bg-white justify-center items-center flex flex-row flex-nowrap top-20 z-2">
        <div className="w-full justify-start px-10 basis-full lg:flx-basis-1/4 py-2 lg:py-0 ">
          <p
            onClick={() => {
              handleBackButtonClick();
            }}
            className="font-semibold  hover:text-lightdark duration-200  cursor-pointer text-dark w-10"
          >
            Back
          </p>
        </div>

        <div className="hidden lg:flex flex-col whitespace-nowrap items-center justify-center px-4 lg:px-8">
          <div>
            <p className="font-semibold px-2 text-dark basis-full flx-basis-1/4 py-0 text-md">
              For Rewards & Discounts Download App
            </p>
          </div>
          <div className="flex flex-row">
            <Link
              href="https://apps.apple.com/us/app/appymeal/id6443683011"
              className="basis-full flx-basis-1/4  py-0"
            >
              <p className="font-semibold px-2 hover:text-lightdark duration-200 cursor-pointer text-dark">
                Download iOS
              </p>
            </Link>
            <Link
              href="https://play.google.com/store/apps/details?id=com.zowen1.AppyMeal&hl=en_US&gl=US"
              className="basis-full flx-basis-1/4  py-0"
            >
              <p className="font-semibold px-2 hover:text-lightdark duration-200 cursor-pointer text-dark">
                Download Android
              </p>
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-smoke w-full h-40  items-center flex pg-4 gap-2  px-8 lg:px-16 justify-between">
        <div className="flex flex-col md:flex-row items-center">
          <div className="justify-start">
            <Image
              src={rest.photo}
              width={125}
              height={125}
              alt="restaurantLogo"
              className="object-cover rounded-xl cursor-pointer"
              onClick={() => {
                router.push(`restaurants/${rest.name}`);
              }}
            />
          </div>
          <div className="hidden md:flex md:flex-col justify-start pl-8">
            <p className="text-sm md:text-xl font-semibold text-dark">
              Ordering From:
            </p>
            <p
              className="font-semibold text-sm md:text-xl hover:text-lightdark duration-200 cursor-pointer text-dark"
              onClick={() => {
                router.push(`restaurants/${rest.name}`);
              }}
            >
              {rest.name}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start gap-1 md:gap-0 ml-2 md:ml-0">
          <p className="text-dark text-sm md:text-lg">
            {rest.address}, {rest.city}, {rest.state}
          </p>
          <HourDisplay hours={rest.hours} />
          <OpenStatus restaurant={rest} militaryTime={militaryTime} />
          <div className="md:hidden text-sm text-dark">
            <p>{rest.name}</p>
          </div>
        </div>
      </div>
      <div className="max-w-contentContainer mx-auto flex-1 w-full">
        <CartPageComponent />
      </div>
    </div>
  );
};

export default Cart;
