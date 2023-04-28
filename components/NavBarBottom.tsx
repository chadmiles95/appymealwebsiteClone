import React from "react";
import { phoneImg } from "../public/assets/images";
import Image from "next/image";
import { FiChevronDown } from "react-icons/fi";
import { FaPlaceOfWorship } from "react-icons/fa";
import { MdOutlineLocationOn } from "react-icons/md";

const NavBarBottom = () => {
  return (
    <div className="max-w-container mx-auto py-2 px-6 flex justify-end">
      {/* <div className="flex item-center gap-4">
        <div className="flex items-center gap-2">
          <Image className="w-6" src={phoneImg} alt="phoneImg" />
          <p className="text-sm font-semibold">How do you want your items?</p>
          <FiChevronDown />
          <span className="w-[1px] h-4 bg-white inline-flex ml-2"></span>
        </div>
        <div className="flex items-center gap-2">
          <MdOutlineLocationOn />
          <p className="text-sm text-zinc-100">Sacramento, 95829</p>
          <FaPlaceOfWorship />
          <p className="text-sm text-zinc-100">Sacramento Supercenter</p>
        </div>
      </div> */}
      <ul className="flex gap-6 text-sm font-semibold">
        <li className="bottomNavLi">Home</li>
        <li className="bottomNavLi">About</li>
        <li className="bottomNavLi">Partner</li>
        <li className="bottomNavLi">Add Restaurant</li>
        <li className="bottomNavLi">Download iOS App</li>
        <li className="bottomNavLi">Download Android App</li>
      </ul>
    </div>
  );
};

export default NavBarBottom;
