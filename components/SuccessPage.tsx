import Link from "next/link";
import React from "react";
import { useDispatch } from "react-redux";
import { resetCart } from "../redux/shoppersSlice";

const SuccessPage = () => {
  // used to remove items and reset cart
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <h1 className="text-2xl text-hoverBg font-semibold">
        Thank you for shopping with us!
      </h1>
      {/* change link later to tracking page for order and remove reset cart? or keep it and take to tracking page for specific order I guess. Could just provide them url and even from app?*/}
      <Link href="/">
        <button
          onClick={() => dispatch(resetCart())}
          className="text-lg text-lightText hover:underline underline-offset-4 decoration-[1px] hover:text-blue duration-300"
        >
          Track Order
        </button>
      </Link>
    </div>
  );
};

export default SuccessPage;
