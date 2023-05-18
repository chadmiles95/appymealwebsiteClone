import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  ship1Img,
  ship2Img,
  ship3Img,
  emptyCart,
  phoneImg,
  warningImg,
} from "../public/assets/images";
import { TbReload } from "react-icons/tb";
import { HiMinusSmall } from "react-icons/hi2";
import { MdClose, MdOutlineAdd } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import { StoreProduct } from "../type";
import FormatPrice from "./FormatPrice";
import { useDispatch } from "react-redux";
import {
  deleteItem,
  minusQuantity,
  plusQuantity,
  resetCart,
} from "../redux/shoppersSlice";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";

const CartPageComponent = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const stripePromise = loadStripe(process.env.stripe_public_key);
  const productData = useSelector((state: any) => state.shopper.productData);
  const userInfo = useSelector((state: any) => state.shopper.userInfo);
  const cart = useSelector((state: any) => state.shopper.productData);
  const [downloadAppMsg, setDownloadAppMsg] = useState(true);

  const [totalOldPrice, setTotalOldPrice] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [totalAmt, setTotalAmt] = useState(0);
  const [selectedTip, setSelectedTip] = useState(15);
  const [tip, setTip] = useState(0);

  const [isPickup, setIsPickup] = useState(true);

  useEffect(() => {
    let amt = 0;

    productData.map((item: StoreProduct) => {
      amt += item.price * item.quantity;
      return;
    });

    let amtWithTip = parseFloat((amt * (1 + selectedTip / 100)).toFixed(2));
    let tipAmt = parseFloat((amt * (selectedTip / 100)).toFixed(2));

    setTip(tipAmt);
    setTotalAmt(amtWithTip);
  }, [productData, selectedTip]);

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const stipreAmt = parseFloat((totalAmt * 100).toFixed(2));

    // create a checkout session
    const checkoutSession = await axios.post("api/create-checkout-session", {
      items: productData,
      email: session?.user?.email,
    });
    // redirect user to stripe checkout
    const result: any = await stripe?.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });
    if (result?.error) {
      alert(result?.error.message);
    }
  };

  function allAreNull(arr: any[]) {
    if (!arr.length) {
      return false;
    }
    return true;
  }
  const handleClick = () => {
    setIsPickup(!isPickup);
  };

  const handleTipChange = (input: any) => {
    setSelectedTip(input);
  };

  return (
    <div className="w-full py-8">
      <div className="w-full flex flex-row flex-wrap lg:flex-nowrap gap-7">
        <div className="basis-full lg:basis-2/3 lg:flex-1 flex-auto flex flex-col gap-5 m-4 relative">
          <h1 className="text-2xl font-bold text-black relative">
            Cart{" "}
            <span className="text-lightText font-normal">
              ({productData.length} items)
            </span>
          </h1>
          {/* pickup details */}
          <div>
            {/* Cart Product */}
            <div className="w-full px-4 py-4 border-[1px] border-zinc-400 rounded-md flex flex-col gap-4 relative">
              <div>
                {productData.map((item: StoreProduct) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-4 gap-4 border-b-[1px] border-b-zinc-200 pb-4 pt-4"
                  >
                    <div className="col-span-3">
                      <h2 className="text-base text-dark">{item.item}</h2>

                      {/* OUTPUT MODIFIERS HERE */}

                      {item.modifiers &&
                        item.modifiers.some(
                          (modifier) => modifier !== null
                        ) && (
                          <div className="overflow-x-auto relative top-0 left-0 px-2 py-2 space-x-1 flex flex-row max-w-full mb-2">
                            {item.modifiers.map((option, index) => {
                              if (option !== null) {
                                return (
                                  <div
                                    key={index}
                                    className="flex items-center justify-center bg-primary rounded-full px-2 h-6 min-w-max whitespace-nowrap"
                                  >
                                    <p className="text-white text-sm">
                                      {option}
                                    </p>
                                  </div>
                                );
                              }
                            })}
                          </div>
                        )}

                      {/* OUTPUT MODIFIERS HERE */}

                      <div className="mt-2 flex items-center gap-6">
                        <button
                          onClick={() => dispatch(deleteItem(item.id))}
                          className="text-sm underline underline-offset-2 decoration-[1px] text-dark hover:no-underline hover:text-lightdark duration-300"
                        >
                          Remove
                        </button>
                        <div className="w-28 h-9 border border-zinc-400 rounded-full text-base font-semibold text-black flex items-center justify-between px-3">
                          <button
                            onClick={() =>
                              dispatch(
                                minusQuantity({
                                  id: item.id,
                                })
                              )
                            }
                            className="text-base w-5 h-5 text-dark hover:bg-dark hover:text-white rounded-full flex items-center justify-center cursor-pointer duration-200"
                          >
                            <HiMinusSmall />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              dispatch(
                                plusQuantity({
                                  id: item.id,
                                })
                              )
                            }
                            className="text-base w-5 h-5 text-dark hover:bg-dark hover:text-white rounded-full flex items-center justify-center cursor-pointer duration-200"
                          >
                            <MdOutlineAdd />{" "}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="w-full text-right flex flex-col items-end gap-1 justify-center">
                      <p className="font-semibold text-xl text-dark">
                        <FormatPrice amount={item.price * item.quantity} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => dispatch(resetCart())}
                className="w-44 bg-primary text-white h-10 rounded-full text-base font-semibold hover:bg-muted duraction-300"
              >
                Reset Cart
              </button>
            </div>
          </div>
        </div>
        <div className="basis-full lg:basis-1/3 lg:flex-1 m-4 p-4 lg:mt-16 h-1/2 border-[1px] border-zinc-400 rounded-md flex flex-col  gap-4">
          <button
            onClick={() => handleCheckout()}
            className="bg-primary hover:bg-muted w-full text-white h-10 rounded-full font-semibold duration-300 mt-2"
          >
            Place {!isPickup ? "Pickup" : "Delivery"} Order | $
            {totalAmt.toFixed(2)}
          </button>
          <div className="w-full flex flex-col  border-b-[1px] border-b-zinc-200 pb-4">
            <div className="py-0 gap-2 flex flex-col ">
              {!downloadAppMsg && (
                <div className="bg-primary text-white p-2 rounded-lg flex items-center justify-between gap-4 mb-2">
                  <Image className="w-8" src={warningImg} alt="warningImg" />
                  <p className="text-sm">
                    You are missing out on{" "}
                    <span className="font-semibold">{totalAmt.toFixed(0)}</span>{" "}
                    points by not ordering through the app!
                  </p>
                  <IoMdClose
                    onClick={() => setDownloadAppMsg(false)}
                    className="text-3xl hover:text-red-400 cursor-pointer duration-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Show cart here */}
          <div className="text-sm font-bold flex items-center gap-2 mb-0">
            <p className="text-dark">Choose Pickup or Delivery </p>
          </div>
          <div className="flex items-center justify-center w-full my-2">
            <button
              className={` w-1/2 transition-colors duration-300 ease-in-out py-2 px-4 rounded-l-full ${
                isPickup ? "bg-blue-500 text-gray" : "bg-dark text-white"
              }`}
              onClick={handleClick}
            >
              Pickup
            </button>
            <button
              className={` w-1/2 transition-colors duration-300 ease-in-out py-2 px-4 rounded-r-full ${
                isPickup ? "bg-dark text-white" : "bg-blue-500 text-gray"
              }`}
              onClick={handleClick}
            >
              Delivery
            </button>
          </div>
          <div className="text-sm font-bold flex items-center gap-2 mb-0">
            <p className="text-dark">Choose Tip </p>
          </div>
          <div className="flex items-center justify-between w-full my-2">
            <button
              className={`w-1/4 h-16 transition-colors duration-300 ease-in-out py-2 px-4 mr-2 rounded-xl border border-gray-300 text-center ${
                selectedTip === 0
                  ? "bg-dark text-white hover:bg-gray-300"
                  : "bg-white text-gray"
              }`}
              onClick={() => handleTipChange(0)}
            >
              0%
            </button>
            <button
              className={`w-1/4 h-16 transition-colors duration-300 ease-in-out py-2 px-4 mr-2 rounded-xl border border-gray-300 text-center ${
                selectedTip === 10
                  ? "bg-dark text-white hover:bg-gray-300"
                  : "bg-white text-gray"
              }`}
              onClick={() => handleTipChange(10)}
            >
              10%
            </button>
            <button
              className={`w-1/4 h-16 transition-colors duration-300 ease-in-out py-2 px-4 mr-2 rounded-xl border border-gray-300 text-center ${
                selectedTip == 15
                  ? "bg-dark text-white hover:bg-gray-300"
                  : "bg-white text-gray"
              }`}
              onClick={() => handleTipChange(15)}
            >
              15%
            </button>
            <button
              className={`w-1/4 h-16 transition-colors duration-300 ease-in-out py-2 px-4 rounded-xl border border-gray-300 text-center ${
                selectedTip === 20
                  ? "bg-dark text-white hover:bg-gray-300"
                  : "bg-white text-gray"
              }`}
              onClick={() => handleTipChange(20)}
            >
              20%
            </button>
          </div>

          {/* checkout price*/}
          <div className="w-full flex flex-col gap-4 border-b-[1px] border-b-zinc-200 pb-4">
            <div className="flex flex-col gap-1">
              <div className="text-sm flex justify-between">
                <p className="font-semibold text-dark">Tip</p>
                <p className="text-dark font-normal text-base">
                  <FormatPrice amount={tip} />
                </p>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-4 border-b-[1px] border-b-zinc-200 pb-4">
            <div className="flex flex-col gap-1">
              <div className="text-sm flex justify-between">
                <p className="text-dark">Delivery</p>
                <p className="text-dark">Free</p>
              </div>
              <div className="text-sm flex justify-between">
                <p className="font-semibold text-dark">Taxes</p>
                <p className="text-dark">Calculated at checkout</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between ">
            <p className="text-dark">Estimated total</p>
            <p className="text-zinc-800 font-bold text-lg">
              <FormatPrice amount={totalAmt} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPageComponent;
