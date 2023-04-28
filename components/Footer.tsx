import Link from "next/link";
import React from "react";

const Footer = () => {
  const instagramUrl = "https://www.instagram.com/appy_meal/";
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const instagramHref = isMobile
    ? `instagram://user?username=${instagramUrl}`
    : instagramUrl;
  const facebookUrl = "fb://page/105744411713965";
  const facebookHref = isMobile
    ? facebookUrl
    : "https://www.facebook.com/AppyMealApp";
  const linkedinUrl = "linkedin://company/appymeal";
  const linkedinHref = isMobile
    ? linkedinUrl
    : "https://www.linkedin.com/company/appymeal/?viewAsMember=true";

  return (
    <div className="w-full bg-dark text-white pt-4 pb-6">
      <div className="max-w-contentContainer mx-auto">
        <ul className="w-full flex flex-wrap gap-1 justify-center text-sm text-zinc-200">
          <Link href="/">
            <li className="bottomFooterHover">Home</li>
          </Link>
          <Link href="/about">
            <li className="bottomFooterHover">About</li>
          </Link>
          <Link href="/about">
            <li className="bottomFooterHover">Partner</li>
          </Link>
          <Link href="/addrestaurant">
            <li className="bottomFooterHover">Add Restaurant</li>
          </Link>
          <Link href="https://apps.apple.com/us/app/appymeal/id6443683011">
            <li className="bottomFooterHover">Download iOS App</li>
          </Link>
          <Link href="https://play.google.com/store/apps/details?id=com.zowen1.AppyMeal&hl=en_US&gl=US">
            <li className="bottomFooterHover">Download Android App</li>
          </Link>

          <Link href={instagramHref}>
            <li className="bottomFooterHover">Instagram</li>
          </Link>
          <Link href={facebookHref}>
            <li className="bottomFooterHover">Facebook</li>
          </Link>
          <Link href={linkedinHref}>
            <li className="bottomFooterHover">LinkedIn</li>
          </Link>
          <Link href="/contact">
            <li className="bottomFooterHover">Contact</li>
          </Link>
        </ul>
        <p className="text-sm text-zinc-300 text-center mt-4">
          © 2023 AppyMeal.com All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
