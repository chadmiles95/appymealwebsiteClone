import Image from "next/image";
import React from "react";
import { home_bg } from "../public/assets/images/index";
import { Spacer } from "./Spacer";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="w-full grid lg:grid-cols-2 h-full bg-[#F1EDEE] font-titleFont flex-1 flex border-b-[1px]">
      <div className="h-[750px] flex">
        <div className="flex flex-col justify-center items-center w-full h-full gap-2">
          <p className="font-semibold text-5xl">Order Online Now</p>
          <Spacer size="small" />
          <Link href="/restaurants">
            <button className="w-72 h-9 bg-white border-[0px] border-dark text-dark   rounded-full flex items-center justify-center gap-1 hover:bg-dark hover:text-white duration-300 shadow-md">
              Order Online
            </button>
          </Link>
          <Spacer size="small" />
          <Spacer size="small" />
          <Spacer size="small" />
          <Spacer size="small" />
          <Spacer size="small" />
          <Spacer size="small" />

          <p className="font-semibold text-4xl text-dark">
            Discounts & Rewards On App
          </p>

          <Spacer size="small" />
          <Link href="https://apps.apple.com/us/app/appymeal/id6443683011">
            <button className="w-72 h-9 bg-white border-[0px] border-dark text-dark   rounded-full flex items-center justify-center gap-1 hover:bg-dark hover:text-white duration-300 shadow-md">
              Download iOS App
            </button>
          </Link>
          <Link href="https://play.google.com/store/apps/details?id=com.zowen1.AppyMeal&hl=en_US&gl=US">
            <button className="w-72 h-9 bg-white border-[0px] border-dark text-dark   rounded-full flex items-center justify-center gap-1 hover:bg-dark hover:text-white duration-300 shadow-md">
              Download Android App
            </button>
          </Link>
        </div>
      </div>
      <div className="flex relative">
        <Image
          className="w-full h-full object-cover"
          src={home_bg}
          alt="LandingPageImg"
        />
      </div>
    </div>
  );
};

export default LandingPage;
