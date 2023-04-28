import Image from "next/image";
import React from "react";
import { home_bg } from "../public/assets/images/index";

const LandingPage = () => {
  return (
    <div className="w-full h-full bg-white px-4 py-6 font-titleFont flex gap-4 border-b-[1px]">
      <div className="w-1/2 h-auto flex">
        <p>hihi</p>
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
