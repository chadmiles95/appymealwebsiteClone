import Image from "next/image";
import React, { useState, useEffect } from "react";

import { CircleLogo } from "../public/assets/images/index";
import { IoSearchOutline } from "react-icons/io5";
import { AiOutlineHeart, AiOutlineUser } from "react-icons/ai";
import { BsCart2 } from "react-icons/bs";
import NavBarBottom from "./NavBarBottom";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useSession, signIn, signOut } from "next-auth/react";
import { addUser, removeUser } from "../redux/shoppersSlice";
import { colors } from "../infastructure/theme/colors";

const Navbar = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  console.log(session);
  const productData = useSelector((state: any) => state.shopper.productData);
  const userInfo = useSelector((state: any) => state.shopper.userInfo);
  const [totalAmt, setTotalAmt] = useState(0);

  useEffect(() => {
    if (session) {
      dispatch(
        addUser({
          name: session.user?.name,
          email: session.user?.email,
          image: session.user?.image,
        })
      );
    } else {
      dispatch(removeUser());
    }
  }, [session, dispatch]);

  useEffect(() => {
    let price = 0;
    productData.map((item: any) => {
      price += item.price * item.quantity;
      return price;
    });
    let usePrice = parseFloat(price.toFixed(2));
    setTotalAmt(usePrice);
  }, [productData]);

  return (
    <div className="w-full bg-smoke text-white sticky top-0 z-50">
      <div className="w-full border-b-[1px] border-b-dark">
        <div className="max-w-container h-20 mx-auto px-4 flex items-center justify-between gap-2">
          {/* LOGO */}
          <Link href="/">
            <div className="navBarHover">
              <Image src={CircleLogo} className="w-12" alt="logo" />
              <span className="">
                <p className="font-semibold text-sm md:text-xl text-dark">
                  AppyMeal
                </p>
              </span>
            </div>
          </Link>

          {/* DEPARTMENTS */}
          <div></div>
          {/* SERVICES */}
          <div>
            <div></div>
          </div>
          <div className="h-10 flex flex-1 relative"></div>
          <div></div>
          {/* account starts here */}
          {userInfo ? (
            <div onClick={() => signOut()} className="navBarHover">
              <Image
                width={500}
                height={500}
                className="w-10 rounded-full object-cover color-dark"
                src={userInfo.image}
                alt="userImage"
              />
              <div>
                <p className="text-xs text-dark">Sign Out</p>
                <h2 className="text-base font-semibold -mt-1 text-dark">
                  {userInfo.name}
                </h2>
              </div>
            </div>
          ) : (
            <div onClick={() => signIn()} className="navBarHover">
              <AiOutlineUser className="text-lg text-dark" />
              <div>
                <p className="text-xs text-dark">Sign In</p>
                <h2 className="text-base font-semibold -mt-1 text-dark">
                  Account
                </h2>
              </div>
            </div>
          )}

          <Link href="/cart">
            <div className="flex flex-col justify-center items-center gap-2 h-14 px-5 rounded-full bg-transparent hover:bg-lightdark duration-300 relative">
              <BsCart2 className="text-2xl text-dark" />
              {/* <p className="text-[10px] -mt-2 text-dark">
                $
                {new Intl.NumberFormat("en-US", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(totalAmt)}
              </p> */}
              <span className="absolute w-4 h-4 bg-dark text-white top-2.5 right-4 rounded-full flex items-center justify-center font-bodyFont text-xs">
                {productData.length > 0 ? productData.length : 0}
              </span>
            </div>
          </Link>
        </div>
      </div>
      {/* <NavBarBottom /> */}
    </div>
  );
};

export default Navbar;
