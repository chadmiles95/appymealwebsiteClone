import React, { useState, useEffect, useRef } from "react";
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
import { getDeliveryQuote } from "../services/delivery";
import Spinner from "./Spinner";
import UseUpdateRestaurantByName from "redux/useUpdateRestaurantByName";

const CartPageComponent = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const stripePromise = loadStripe(process.env.stripe_public_key || "");
  const productData = useSelector((state: any) => state.shopper.productData);
  const userInfo = useSelector((state: any) => state.shopper.userInfo);
  const cart = useSelector((state: any) => state.shopper.productData);
  const rest = useSelector((state: any) => state.shopper.currentRestaurant);
  const currentTime = useSelector((state: any) => state.shopper.currentTime);
  const militaryTime = useSelector((state: any) => state.shopper.militaryTime);
  const menuSelected = useSelector((state: any) => state.shopper.menuSelected);
  const [downloadAppMsg, setDownloadAppMsg] = useState(true);

  const [totalOldPrice, setTotalOldPrice] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [totalAmt, setTotalAmt] = useState(0);
  const [selectedTip, setSelectedTip] = useState(15);
  const [tip, setTip] = useState(0);
  const [taxAmt, setTaxAmt] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryQuote, setDeliveryQuote] = useState(0);
  const [deliveryAccepted, setDeliveryAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isPickup, setIsPickup] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [tempUserEmail, setTempUserEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  // delivery address stuff
  console.log("rest?.taxRate", rest?.taxRate);

  const deliveryAddressRef = useRef(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof window?.google !== "undefined"
    ) {
      const autocomplete =
        window?.google?.maps?.places?.Autocomplete &&
        new window.google.maps.places.Autocomplete(deliveryAddressRef.current);

      if (autocomplete) {
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const zip = place.address_components.find((ac: any) =>
            ac.types.includes("postal_code")
          )?.short_name;
          const state = place.address_components.find((ac: any) =>
            ac.types.includes("administrative_area_level_1")
          )?.short_name;

          if (
            !zip ||
            !state ||
            !place.address_components[0]?.long_name ||
            !place.address_components[1]?.short_name ||
            !place.address_components[2]?.short_name
          ) {
            setDeliveryQuote(0);
            setIsLoading(false);
            setDeliveryAccepted(false);
            alert("Address not accepted!");
            return;
          } else {
            let tempAddress = `${place.address_components[0].long_name} ${place.address_components[1].short_name} ${place.address_components[2].short_name}, ${state} ${zip}`;

            setDeliveryAddress(tempAddress);
            setIsLoading(true);
            let randID = `testID: ${Math.random() * 10000}`;
            let restAddress = `${rest.address} ${rest.city}, ${rest.state} ${rest.zip}`;
            // //  trying to get Doordash delivery need to add checks right before this if they are inhouse
            // // if(rest.deliveryType.type === "DoorDash" && rest.enableDelivery === true){}

            try {
              getDeliveryQuote(randID, tempAddress, restAddress).then(
                (result: any) => {
                  if (result.hasOwnProperty("data")) {
                    console.log("result.data.data.fee", result.data.data.fee);
                    console.log("DELIVERT FEE", result.data.data.fee);
                    setDeliveryQuote(result.data.data.fee);
                    setDeliveryAccepted(true);
                    setIsLoading(false);
                  } else {
                    setDeliveryQuote(0);
                    setIsLoading(false);
                    setDeliveryAccepted(false);
                    if (result !== null) {
                      if (
                        result?.message ===
                        "Allowed distance between addresses exceeded"
                      ) {
                        alert("Address is outside delivery range!");
                        setDeliveryQuote(0);
                        setDeliveryAccepted(false);
                      } else {
                        alert("Invalid delivery address!");
                        setDeliveryQuote(0);
                        setDeliveryAccepted(false);
                      }
                    } else {
                      alert("Invalid delivery address!");
                      setDeliveryQuote(0);
                      setDeliveryAccepted(false);
                    }
                  }
                }
              );
            } catch (error) {
              setDeliveryQuote(0);
              setDeliveryAccepted(false);
              setIsLoading(false);
              alert(
                "Issue getting delivery quote. Please try again or try new address."
              );
            }
          }
        });
      }
    }
  }, [isPickup, rest]);

  useEffect(() => {
    let amt = 0;

    productData.map((item: StoreProduct) => {
      amt += item.price * item.quantity;
      return;
    });

    //add in tax

    setTaxAmt(rest?.taxRate ? amt * (rest?.taxRate / 100) : 0);

    let tempTaxAmt = rest?.taxRate ? amt * (rest?.taxRate / 100) : 0;

    let amtWithTip = parseFloat(
      (
        amt * (1 + selectedTip / 100) +
        parseFloat((deliveryQuote / 100).toFixed(2)) +
        tempTaxAmt
      ).toFixed(2)
    );
    let tipAmt = parseFloat((amt * (selectedTip / 100)).toFixed(2));

    setTip(tipAmt);
    setTotalAmt(amtWithTip);
  }, [productData, selectedTip, deliveryQuote, rest?.taxRate]);

  const handleCheckout = async () => {
    //check restaurant

    let updatedRest;
    try {
      updatedRest = await UseUpdateRestaurantByName(rest.name);
    } catch (err) {
      console.log("err", err);
      alert("Error checking restaurant. Please try again.");
      return; // Exit the function
    }
    console.log("updatedRest", updatedRest);

    if (!updatedRest) {
      alert("Issues contacting restaurant. Please try again.");
      return; // Exit the function
    }

    let passChecks;
    try {
      passChecks = await checkoutChecks(updatedRest);
    } catch (err) {
      alert("Error in checkout. Please try again.");
      return; // Exit the function
    }

    console.log("passChecks", passChecks);
    if (!passChecks) {
      alert("Checkout checks failed. Please try again.");
      return; // Exit the function
    }

    const stripe = await stripePromise;
    const stipreAmt = parseFloat((totalAmt * 100).toFixed(2));

    try {
      // create a checkout session

      let useEmail = session?.user?.email
        ? session?.user?.email
        : tempUserEmail;

      const checkoutSession = await axios.post("api/create-checkout-session", {
        items: productData,
        email: session?.user?.email,
        tip: tip,
        tax: taxAmt,
        deliveryFee: deliveryQuote,
      });

      // console.log("checkoutSession", checkoutSession);
      // redirect user to stripe checkout
      const result: any = await stripe?.redirectToCheckout({
        sessionId: checkoutSession.data.id,
      });
      if (result?.error) {
        alert(result?.error.message);
      }
    } catch (err) {
      console.error("Error during checkout: ", err);
    }
  };

  //REST CHECKS

  const checkoutChecks = async (res: any) => {
    return new Promise((resolve, reject) => {
      if (res.menuSelected !== menuSelected) {
        setIsLoading(false);
        alert("Restaurant menu not available");
        resolve(false);
      }
      // LAYER  - checking if menu is available for restaurant
      else {
        if (res.isOpen === false) {
          setIsLoading(false);
          alert("Restaurant is currently closed");
          resolve(false);
        }
        // LAYER 2 - checking if rest is closed by open/closed boolean value
        else {
          let tempHour = parseFloat(currentTime.getUTCHours());
          let tempMin = parseFloat(currentTime.getMinutes());

          let tempTime;
          tempMin.toString().length === 1
            ? (tempTime = `${tempHour}0${tempMin}`)
            : (tempTime = `${tempHour}${tempMin}`);

          if (
            parseFloat(res.hours.substr(5, 4)) <= parseFloat(tempTime) ||
            parseFloat(tempTime) < parseFloat(res.hours.substr(0, 4)) ||
            res.hours === "closed" ||
            (res.menuHours !== "All Day" &&
              (parseFloat(tempTime) < parseFloat(res.menuHours.substr(0, 4)) ||
                parseFloat(tempTime) >= parseFloat(res.menuHours.substr(5, 4))))
          ) {
            // console.log(res.hours);

            setIsLoading(false);
            alert("Restaurant is currently closed");
            resolve(false);
          } else {
            if (isPickup === false) {
              if (
                deliveryQuote === undefined ||
                deliveryQuote === null ||
                deliveryAddress.length === 0 ||
                deliveryAccepted === false
              ) {
                setIsLoading(false);
                alert("Please check delivery address");
                resolve(false);
              } else if (name?.length === 0 || phoneNumber?.length === 0) {
                alert(
                  "Please fill out name and phone number fields on the information tab."
                );
                setIsLoading(false);
                resolve(false);
              } else if (totalAmt > 30000) {
                setIsLoading(false);

                alert("Order over $300. Please call restaurant");
                resolve(false);
              } else {
                resolve(true);
              }
            }

            // LAYER 4 - checking if it was a delivery that it has all the necessary stuff
            else {
              if (name?.length === 0 || phoneNumber?.length === 0) {
                alert(
                  "Please fill out name and phone number fields on the information tab."
                );
                setIsLoading(false);
                resolve(false);
              }
              // LAYER 5 - checking if total is over 300
              else if (totalAmt > 30000) {
                setIsLoading(false);

                alert("Order over $300. Please call restaurant");
                resolve(false);
              }
              // LAYER 5 - checking if cart total is under $300 - manual limit set to prevent crazy big fake orders or slamming restaurants with a big order - REMOVING DO NOT NEED
              else {
                resolve(true);
              }
            }
          }
        }
      }
    });
  };

  function allAreNull(arr: any[]) {
    if (!arr.length) {
      return false;
    }
    return true;
  }
  const handleClickPickup = () => {
    setIsPickup(true);
    setDeliveryQuote(0);
  };

  const handleClickDelivery = () => {
    rest.enableDelivery === true
        ? setIsPickup(false)
        : alert("Delivery Not available");
  };

  const handleTipChange = (input: any) => {
    setSelectedTip(input);
  };

  return (
    <div className="w-full py-8 h-full">
      <div className="w-full flex flex-row flex-wrap lg:flex-nowrap gap-7">
        <div className="basis-full lg:basis-2/3 lg:flex-1 flex-auto flex flex-col gap-5 m-4 relative z-0">
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
        <div className="basis-full lg:basis-1/3 lg:flex-1 m-4 p-4 lg:mt-16 h-1/2 border-[1px] border-zinc-400 rounded-md flex flex-col gap-4">
          <button
            onClick={() => {
              if (!isPickup && deliveryAccepted === false) {
                alert("Please check delivery address");
              } else if (!session?.user?.email && tempUserEmail === null) {
                alert("Please fill in email");
              } else if (!isPickup && phoneNumber?.length !== 10) {
                alert("Please fix phone number");
              } else if (!productData?.length) {
                alert("Cart is empty");
              } else {
                handleCheckout();
              }
            }}
            className="bg-primary hover:bg-muted w-full text-white h-10 rounded-full font-semibold duration-300 mt-2"
          >
            Place {isPickup ? "Pickup" : "Delivery"} Order | $
            {totalAmt.toFixed(2)}
          </button>
          <div className="w-full flex flex-col  border-b-[1px] border-b-zinc-200 pb-4">
            <div className="py-0 gap-2 flex flex-col ">
              {downloadAppMsg && (
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
                !isPickup ? "bg-blue-500 text-gray" : "bg-dark text-white"
              }`}
              onClick={handleClickPickup}
            >
              Pickup
            </button>
            <button
              className={` w-1/2 transition-colors duration-300 ease-in-out py-2 px-4 rounded-r-full ${
                !isPickup ? "bg-dark text-white" : "bg-blue-500 text-gray"
              }`}
              onClick={handleClickDelivery}
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

          {/* tip price*/}
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

          {/* enter email */}
          {/* MIGHT NOT NEED SINCE CUSTOMER HAS TO ENTER ON STRIPE ANYWAYS ~ TRY AND GET ON RESPONSE OBJECT */}
          {!session?.user?.email && (
            <>
              <div className="text-sm font-bold flex items-center gap-2 mt-0">
                <p className="text-dark">Enter Email</p>
              </div>
              <div className="flex items-center justify-between w-full mb-2">
                <div className="h-12 w-full flex flex-1 relative">
                  <input
                    onChange={(val: any) => setTempUserEmail(val.target.value)}
                    type="text"
                    placeholder="EX: LocalFoodie@gmail.com"
                    className="h-full w-full rounded-full px-4 text-dark text-base outline-none border-[1px] border-transparent focus-visible:border-dark duraction-200
  shadow-md"
                  />
                </div>
              </div>
            </>
          )}
          {/* enter name */}
          <div className="text-sm font-bold flex items-center gap-2 mt-0">
            <p className="text-dark">Enter Name</p>
          </div>
          <div className="flex items-center justify-between w-full mb-2">
            <div className="h-12 w-full flex flex-1 relative">
              <input
                onChange={(val: any) => setName(val.target.value)}
                type="text"
                placeholder="EX: Zach"
                className="h-full w-full rounded-full px-4 text-dark text-base outline-none border-[1px] border-transparent focus-visible:border-dark duraction-200
  shadow-md"
              />
            </div>
          </div>

          {/* Delivery information goes here */}

          {isPickup === false && (
            <div>
              {/* add phone number if delivery is popped */}
              <div className="text-sm font-bold flex items-center gap-2 mt-0">
                <p className="text-dark">Enter Phone Number</p>
              </div>
              <div className="flex items-center justify-between w-full my-4 ">
                <div className="h-12 w-full flex flex-1 relative">
                  <input
                    onChange={(val: any) => setPhoneNumber(val.target.value)}
                    type="text"
                    placeholder="EX: 7702224444"
                    className="h-full w-full rounded-full px-4 text-dark text-base outline-none border-[1px] border-transparent focus-visible:border-dark duraction-200
  shadow-md"
                  />
                </div>
              </div>
              <div className="text-sm font-bold flex items-center gap-2 mb-4 mt-6">
                <p className="text-dark">Enter Delivery Address </p>
              </div>
              <div className="flex items-center justify-between w-full my-2">
                <div className="h-12 w-full flex flex-1 relative">
                  <input
                    ref={deliveryAddressRef}
                    type="text"
                    placeholder="EX: 123 Appy St, Grayson, GA 30017"
                    className="h-full w-full rounded-full px-4 text-dark text-base outline-none border-[1px] border-transparent focus-visible:border-dark duraction-200
  shadow-md"
                  />
                </div>
              </div>

              <div className="w-full flex flex-col gap-4 border-b-[1px] border-b-zinc-200 pb-4 pt-4">
                <div className="flex flex-col gap-1">
                  <div className="text-sm flex justify-between">
                    <p className="font-semibold text-dark">Delivery Quote</p>
                    {isLoading ? (
                      <Spinner />
                    ) : (
                      <p className="text-dark font-normal text-base">
                        <FormatPrice amount={deliveryQuote / 100} />
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* rest of cart infomration with pricing */}
          <div className="w-full flex flex-col gap-4 border-b-[1px] border-b-zinc-200 pb-4">
            <div className="flex flex-col gap-1">
              <div className="text-sm flex justify-between">
                <p className="font-semibold text-dark">Taxes</p>
                <p className="text-dark font-normal text-base">
                  <FormatPrice amount={taxAmt} />
                </p>
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
