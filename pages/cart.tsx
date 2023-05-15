import React from "react";
import CartPageComponent from "../components/CartPageComponent";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const cart = () => {
  const lastURL = useSelector((state: any) => state.shopper.lastVisitedPage);
  const router = useRouter();

  const handleBackButtonClick = () => {
    if (lastURL) {
      router.push(lastURL);
    } else {
      // If there's no last visited page, navigate to a default page or handle this case as needed
      router.push("/");
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col">
      <div className="w-full h-12 lg:h-14 bg-white justify-center items-center flex flex-row flex-nowrap lg:sticky top-20 z-10">
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

        <div className="flex flex-col whitespace-nowrap items-center justify-center w-1/2 px-4">
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
      <div className="bg-smoke w-full h-40  items-center flex pg-4 gap-2  px-4 lg:px-16 justify-between">
        <div className="flex items-center">
          <div className="justify-start">
            <Image
              src={
                "https://firebasestorage.googleapis.com/v0/b/mealstogo-dabbc.appspot.com/o/Sam%E2%80%99s%20On%20Main-restaurant.jpg?alt=media&token=03721753-480a-4dcd-87f8-ccbdc1947e08"
              }
              width={125}
              height={125}
              alt="restaurantLogo"
              className="object-cover rounded-xl"
            />
          </div>
          <div className="justify-start pl-8 flex flex-col">
            <p className="text-xl font-semibold text-dark">Ordering From:</p>
            <p className="text-xl font-semibold text-dark">Sam's On Main</p>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start">
          <p className="text-dark">
            2135 Loganville Hwy, Suite 420 Grayson, GA
          </p>
          <p className="text-dark">Hours - 11:00 AM - 8:00 PM</p>
          <p className="text-dark">Status - Open</p>
        </div>
      </div>
      <div className="max-w-contentContainer mx-auto flex-1 w-full">
        <CartPageComponent />
      </div>
    </div>
  );
};

export default cart;
