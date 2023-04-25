import Image from "next/image";
import React from "react";

interface Props {
  title: string;
  description: string;
  btnText: string;
  className: string;
}

const BannerText = ({ title, description, btnText, className }: Props) => {
  return (
    <div className={className}>
      <h1 className="font-bold text-2xl">{title}</h1>
      <p className="test-sm leading-5"> {description}</p>
      <button className="bg-white text-sm text-black font-semibold rounded-full w-24 h-8 border-[1px] border-black">
        {btnText}
      </button>
    </div>
  );
};

export default BannerText;
