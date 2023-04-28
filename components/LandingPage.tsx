import Image from "next/image";
import React from "react";
import { home_bg } from "../public/assets/images/index";
import { Spacer } from "./Spacer";

const LandingPage = () => {
  return (
    <div className="w-full h-full bg-[#F1EDEE]  font-titleFont flex gap-4 border-b-[1px]">
      <div className="w-1/2 h-auto flex">
        <div className="flex flex-col justify-center items-center w-full h-full gap-2">
          <button className="w-72 h-9 bg-white border-[1px] border-black text-black   rounded-full flex items-center justify-center gap-1 hover:bg-black hover:text-white duration-300">
            Order Online
          </button>

          <Spacer size="small" />
          <Spacer size="large" />
          <Spacer size="small" />
          <Spacer size="small" />
          <Spacer size="small" />

          <p>Earn discounts & rewards on the App</p>
          <button className="w-72 h-9 bg-white border-[1px] border-black text-black   rounded-full flex items-center justify-center gap-1 hover:bg-black hover:text-white duration-300">
            Download iOS App
          </button>
          <button className="w-72 h-9 bg-white border-[1px] border-black text-black   rounded-full flex items-center justify-center gap-1 hover:bg-black hover:text-white duration-300">
            Download Android App
          </button>
        </div>
      </div>
      <div className="w-1/2 h-auto flex relative">
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
