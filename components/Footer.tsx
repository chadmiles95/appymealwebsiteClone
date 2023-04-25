import React from "react";

const Footer = () => {
  return (
    <div className="w-full bg-hoverBg text-white pt-4 pb-6">
      <div className="max-w-contentContainer mx-auto">
        <ul className="w-full flex flex-wrap gap-1 justify-center text-sm text-zinc-200">
          <li className="bottomFooterHover">All Departments</li>
          <li className="bottomFooterHover">Our Company</li>
          <li className="bottomFooterHover">Careers</li>
          <li className="bottomFooterHover">Help</li>
          <li className="bottomFooterHover">Product Recalls</li>
          <li className="bottomFooterHover">Accessibility</li>
          <li className="bottomFooterHover">Privacy & Security</li>
          <li className="bottomFooterHover">Your Privacy Choices</li>
          <li className="bottomFooterHover">Request Personal Information</li>
          <li className="bottomFooterHover">Get The App</li>
          <li className="bottomFooterHover">Sign-Up For Email</li>
          <li className="bottomFooterHover">Safety Data Sheet</li>
          <li className="bottomFooterHover">Terms Of Use</li>
          <li className="bottomFooterHover">#IYWYK</li>
        </ul>
        <p className="text-sm text-zinc-300 text-center mt-4">
          © 2023 Shoppers.com All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
