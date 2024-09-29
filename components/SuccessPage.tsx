import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetCart } from "../redux/shoppersSlice";
import { Spacer } from "./Spacer";
import Image from "next/image";
import { CircleLogo } from "public/assets/images";

const SuccessPage = () => {
  // used to remove items and reset cart
  const order = useSelector((state: any) => state.shopper.order); // Access the order object from Redux state
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetCart());
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <button
        // onClick={() => dispatch(resetCart())}
        className="text-lg text-dark "
      >
        <p className="text-xl md:text-2xl text-primary font-semibold ">
          Thank you for helping us support local restaurants!
        </p>
      </button>
      <Image src={CircleLogo} className="w-12 lg:w-40" alt="logo" />

      <div></div>

      {/* change link later to tracking page for order and remove reset cart? or keep it and take to tracking page for specific order I guess. Could just provide them url and even from app?*/}

      <button
        // onClick={() => dispatch(resetCart())}
        className="text-lg text-dark pl-4 pr-4"
      >
        <h2 className="text-dark">Order Details:</h2>
        <p className="text-dark">Order Number: {order?.number}</p>
        <p className="text-dark">
          Expected pickup time: {order?.expectedPickupTime}
        </p>
        <p className="text-dark">Restaurant: {order?.restaurant}</p>
        <p className="text-dark">
          Address: {order?.doorDashInfo?.pickup_address}
        </p>
      </button>
    </div>
  );
};

export default SuccessPage;
