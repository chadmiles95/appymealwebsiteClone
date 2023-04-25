import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFoundImg } from "../public/assets/images";

const Custom404 = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center pb-2">
      <Image
        src={notFoundImg}
        alt="notFoundImg"
        className="w-full h-[550px] object-cover"
      />
      <Link href="/">
        <button className="mt-2 text-sm hover:text-[#004f9a] hover:underline underline-offset-2">
          Back to home
        </button>
      </Link>
    </div>
  );
};

export default Custom404;
