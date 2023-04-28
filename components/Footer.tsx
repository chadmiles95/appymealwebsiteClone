import React from "react";

const Footer = () => {
  return (
    <div className="w-full bg-[#240115] text-white pt-4 pb-6">
      <div className="max-w-contentContainer mx-auto">
        <ul className="w-full flex flex-wrap gap-1 justify-center text-sm text-zinc-200">
          <li className="bottomFooterHover">Home</li>
          <li className="bottomFooterHover">About</li>
          <li className="bottomFooterHover">Partner</li>
          <li className="bottomFooterHover">Add Restaurant</li>
          <li className="bottomFooterHover">Download iOS App</li>
          <li className="bottomFooterHover">Download Android App</li>
          <li className="bottomFooterHover">Instagram</li>
          <li className="bottomFooterHover">Facebook</li>
          <li className="bottomFooterHover">Linkedin</li>
          <li className="bottomFooterHover">Contact</li>
        </ul>
        <p className="text-sm text-zinc-300 text-center mt-4">
          © 2023 AppyMeal.com All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
