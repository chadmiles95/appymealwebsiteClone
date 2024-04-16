import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { download } from "../public/assets/images";
import { HiMinusSmall } from "react-icons/hi2";
import { MdOutlineAdd } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import { StoreProduct } from "../type";
import FormatPrice from "./FormatPrice";
import {
  deleteItem,
  minusQuantity,
  plusQuantity,
  resetCart,
  setOrder,
} from "../redux/shoppersSlice";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useSession } from "next-auth/react";
import { getRestaurantByName } from "services/restaurants";
import { getDeliveryQuote } from "../services/delivery";
import Spinner from "./Spinner";
import { getOrderNumber } from "services/ordernumber";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/pages/_app";
import useGoogleMaps from "./useGoogleMaps";
import { isMenuHours, isRestaurantHours } from "./RestaurantCard";

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
  const [cartTotal, setCartTotal] = useState(0);
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
  const [isAlertVisible, setAlertVisible] = useState(false);

  const deliveryAddressRef = useRef(null);

  const initAutocomplete = () => {
    if (window.google && deliveryAddressRef) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        deliveryAddressRef.current
      );

      // Add a listener for the "place_changed" event on the autocomplete object
      if (autocomplete) {
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          // Your existing logic for handling place changes can go here
          // For example, extracting zip, state, etc., and setting them in your component's state
          //change miles to be distance from place object by miles like 1 or 2.4. use the calculateDistance function to find distance between returned lat and lng and restaurant alt and lng

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
            let restAddress = `${rest.address || rest.address_line_1} ${rest.city || rest.address_city}, ${rest.state || rest.address_state_province_id} ${rest.zip || rest.address_zipcode}`;

            if ((rest.deliveryType || rest.delivery_type).type === "DoorDash") {
              try {
                getDeliveryQuote(randID, tempAddress, restAddress).then(
                  (result: any) => {
                    if (result.hasOwnProperty("data")) {
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
                          setIsLoading(false);
                        } else {
                          alert("Invalid delivery address!");
                          setDeliveryQuote(0);
                          setDeliveryAccepted(false);
                          setIsLoading(false);
                        }
                      } else {
                        alert("Invalid delivery address!");
                        setDeliveryQuote(0);
                        setDeliveryAccepted(false);
                        setIsLoading(false);
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
            } else {
              calculateDistance({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              }).then((miles: number) => {
                if (miles <= 5) {
                  setDeliveryQuote(
                    parseFloat(((rest.deliveryType || rest.delivery_type).near.price * 100).toFixed(2))
                  );
                  setDeliveryAccepted(true);
                  setIsLoading(false);
                } else if (
                  miles <= 10 &&
                  (rest.deliveryType || rest.delivery_type).far.enable === true
                ) {
                  setDeliveryQuote(
                    parseFloat(((rest.deliveryType || rest.delivery_type).far.price * 100).toFixed(2))
                  );
                  setDeliveryAccepted(true);
                  setIsLoading(false);
                } else {
                  alert("Address is outside delivery range!");
                  setDeliveryQuote(0);
                  setDeliveryAccepted(false);
                  setIsLoading(false);
                }
              });
            }
          }
        });
      }
    }
  };

  // Use the hook to ensure Google Maps API is loaded
  useGoogleMaps(initAutocomplete);

  useEffect(() => {
    // if (
    //   typeof window !== "undefined" &&
    //   typeof window?.google !== "undefined"
    // ) {
    //   const autocomplete =
    //     window?.google?.maps?.places?.Autocomplete &&
    //     new window.google.maps.places.Autocomplete(deliveryAddressRef.current);
    //   if (autocomplete) {
    //     autocomplete.addListener("place_changed", () => {
    //       const place = autocomplete.getPlace();
    //       //change miles to be distance from place object by miles like 1 or 2.4. use the calculateDistance function to find distance between returned lat and lng and restaurant alt and lng
    //       const zip = place.address_components.find((ac: any) =>
    //         ac.types.includes("postal_code")
    //       )?.short_name;
    //       const state = place.address_components.find((ac: any) =>
    //         ac.types.includes("administrative_area_level_1")
    //       )?.short_name;
    //       if (
    //         !zip ||
    //         !state ||
    //         !place.address_components[0]?.long_name ||
    //         !place.address_components[1]?.short_name ||
    //         !place.address_components[2]?.short_name
    //       ) {
    //         setDeliveryQuote(0);
    //         setIsLoading(false);
    //         setDeliveryAccepted(false);
    //         alert("Address not accepted!");
    //         return;
    //       } else {
    //         let tempAddress = `${place.address_components[0].long_name} ${place.address_components[1].short_name} ${place.address_components[2].short_name}, ${state} ${zip}`;
    //         setDeliveryAddress(tempAddress);
    //         setIsLoading(true);
    //         let randID = `testID: ${Math.random() * 10000}`;
    //         let restAddress = `${rest.address} ${rest.city}, ${rest.state} ${rest.zip}`;
    //         if ((rest.deliveryType || rest.delivery_type).type === "DoorDash") {
    //           try {
    //             getDeliveryQuote(randID, tempAddress, restAddress).then(
    //               (result: any) => {
    //                 if (result.hasOwnProperty("data")) {
    //                   setDeliveryQuote(result.data.data.fee);
    //                   setDeliveryAccepted(true);
    //                   setIsLoading(false);
    //                 } else {
    //                   setDeliveryQuote(0);
    //                   setIsLoading(false);
    //                   setDeliveryAccepted(false);
    //                   if (result !== null) {
    //                     if (
    //                       result?.message ===
    //                       "Allowed distance between addresses exceeded"
    //                     ) {
    //                       alert("Address is outside delivery range!");
    //                       setDeliveryQuote(0);
    //                       setDeliveryAccepted(false);
    //                       setIsLoading(false);
    //                     } else {
    //                       alert("Invalid delivery address!");
    //                       setDeliveryQuote(0);
    //                       setDeliveryAccepted(false);
    //                       setIsLoading(false);
    //                     }
    //                   } else {
    //                     alert("Invalid delivery address!");
    //                     setDeliveryQuote(0);
    //                     setDeliveryAccepted(false);
    //                     setIsLoading(false);
    //                   }
    //                 }
    //               }
    //             );
    //           } catch (error) {
    //             setDeliveryQuote(0);
    //             setDeliveryAccepted(false);
    //             setIsLoading(false);
    //             alert(
    //               "Issue getting delivery quote. Please try again or try new address."
    //             );
    //           }
    //         } else {
    //           calculateDistance({
    //             lat: place.geometry.location.lat(),
    //             lng: place.geometry.location.lng(),
    //           }).then((miles: number) => {
    //             if (miles <= 5) {
    //               setDeliveryQuote(
    //                 parseFloat(((rest.deliveryType || rest.delivery_type).near.price * 100).toFixed(2))
    //               );
    //               setDeliveryAccepted(true);
    //               setIsLoading(false);
    //             } else if (
    //               miles <= 10 &&
    //               (rest.deliveryType || rest.delivery_type).far.enable === true
    //             ) {
    //               setDeliveryQuote(
    //                 parseFloat(((rest.deliveryType || rest.delivery_type).far.price * 100).toFixed(2))
    //               );
    //               setDeliveryAccepted(true);
    //               setIsLoading(false);
    //             } else {
    //               alert("Address is outside delivery range!");
    //               setDeliveryQuote(0);
    //               setDeliveryAccepted(false);
    //               setIsLoading(false);
    //             }
    //           });
    //         }
    //       }
    //     });
    //   }
    // }
  }, [isPickup, rest]);

  const calculateDistance = (cord1: { lat: number; lng: number }) => {
    return new Promise<number>((resolve) => {
      let cord2 = {
        lat: rest.lat,
        lng: rest.lng,
      };

      if (cord2 && cord1) {
        if (cord1.lat === cord2.lat && cord1.lng === cord2.lng) {
          resolve(0);
        }

        const radlat1 = (Math.PI * cord1.lat) / 180;
        const radlat2 = (Math.PI * cord2.lat) / 180;

        const theta = cord1.lng - cord2.lng;
        const radtheta = (Math.PI * theta) / 180;

        let dist =
          Math.sin(radlat1) * Math.sin(radlat2) +
          Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

        if (dist > 1) {
          dist = 1;
        }

        dist = Math.acos(dist);
        dist = (dist * 180) / Math.PI;
        dist = dist * 60 * 1.1515;

        resolve(Number(dist)); // Convert distance to a number
      }
    });
  };

  useEffect(() => {
    let amt = 0;

    productData.map((item: StoreProduct) => {
      amt += parseFloat(((item.price * item.quantity) / 100).toFixed(2));
      return;
    });

    setCartTotal(amt);

    //add in tax

    setTaxAmt(
      rest?.taxRate ? parseFloat((amt * (rest?.taxRate / 100)).toFixed(2)) : 0
    );

    let tempTaxAmt = rest?.taxRate ? amt * (rest?.taxRate / 100) : 0;

    let amtWithTip = parseFloat(
      (
        parseFloat((amt * 100).toFixed(2)) * (1 + selectedTip / 100) +
        parseFloat(deliveryQuote.toFixed(2)) +
        parseFloat((amt * rest?.taxRate).toFixed(2))
      ).toFixed(2)
    );
    let tipAmt = parseFloat((amt * (selectedTip / 100)).toFixed(2));

    setTip(parseFloat(tipAmt.toFixed(2)));
    setTotalAmt(parseFloat(amtWithTip.toFixed(2)));
  }, [productData, selectedTip, deliveryQuote, rest?.taxRate]);

  const handleCheckout = async () => {
    //check restaurant

    let updatedRest;
    try {
      updatedRest = await getRestaurantByName(rest.name);
    } catch (err) {
      console.log("err", err);
      alert("Error checking restaurant. Please try again.");
      return; // Exit the function
    }

    if (!updatedRest) {
      alert("Issues contacting restaurant. Please try again.");
      return; // Exit the function
    }

    let passChecks;
    try {
      passChecks = await checkoutChecks(updatedRest);
    } catch (err) {
      console.log("err", err);
      // alert("Error in checkout. Please try again.");
      return; // Exit the function
    }

    console.log("passChecks", passChecks);
    if (!passChecks) {
      // alert("Checkout checks failed. Please try again.");
      return; // Exit the function
    } else {
      //start getting order logic and order number setup

      const taxRate = updatedRest?.taxRate || updatedRest?.fee_tax_rate || 0;
      const webFee = updatedRest?.webFee || updatedRest?.fee_web || 0;
      let orderNumber = null;
      orderNumber = await getOrderNumber();

      let orderTempUserEmail = session?.user?.email
        ? session?.user?.email?.toLowerCase()
        : tempUserEmail?.toLowerCase();
      let tempRestEmail = updatedRest?.email?.toLowerCase();

      let recordTax = parseFloat((taxRate - 1).toFixed(2));

      let ddRestAddress = `${updatedRest.address || updatedRest.address_line_1} ${updatedRest.city || updatedRest.address_city}, ${updatedRest.state || updatedRest.address_state_province_id}, ${updatedRest.zip || updatedRest.address_zipcode}`;

      const stipreAmt = parseFloat((totalAmt * 100).toFixed(2));

      let appyFee = parseFloat(
        ((totalAmt / 100) * (webFee / 100)).toFixed(2)
      );

      if (orderNumber === null) {
        alert("Issues connecting to server. Please try again.");
        setIsLoading(false);
        return;
      }

      let recordTip = selectedTip === 0 ? 0 : selectedTip / 100;

      let dasherTip = parseFloat(((tip / 2) * 100).toFixed(0));

      let tempCalculatedTip = tip;

      isPickup === false && (updatedRest?.deliveryType || updatedRest.delivery_type)?.type === "DoorDash"
        ? (tempCalculatedTip = parseFloat((tip - dasherTip / 100).toFixed(2)))
        : null;

      // let tempEmail = user.email ? user.email : userEmail;

      let doorDashInfo = {
        external_delivery_id: parseFloat(orderNumber),
        pickup_business_name: updatedRest.name,
        pickup_address: ddRestAddress,
        pickup_phone_number: updatedRest.phoneNumber,
        dropoff_address: deliveryAddress,
        dropoff_phone_number: phoneNumber,
        locale: "en-US",
        dropoff_contact_given_name: name,
        order_value: totalAmt,
        currency: "USD",
        order_contains: {
          alcohol: false,
        },
        tip: dasherTip,
        dasher_allowed_vehicles: ["car", "bicycle", "walking"],
        dropoff_requires_signature: false,
        customer: {
          // TODO: Use a more reliable phone number formatter function (see normalize-phone-number.ts in appymeal-services)
          phone_number: `+1${phoneNumber}`,
          business_name: "AppyMeal",
          first_name: name,
          last_name: "",
          email: orderTempUserEmail,
          should_send_notifications: true,
          locale: "en-US",
        },
      };

      let date = await getTodaysDate();
      let fullD = await getCurrentFullTimeTest();
      let currentTime = await getCurrentTime();

      let expectedPickupTime = await getExpectedWaitTime(
        updatedRest?.expectedWaitTime
      );

      //fix cart here:

      const expandedCart = cart
        .map((item: any) => {
          return Array(item?.quantity)
            .fill(undefined)
            .map(() => ({
              ...item,
              quantity: 1,
              modifiers: [...item?.modifiers], // This ensures a shallow copy of the modifiers array
            }));
        })
        .flat();

      //full order data

      let order = {
        cart: expandedCart,
        customer: name,
        stripeTotal: totalAmt,
        total: totalAmt,
        restaurant: updatedRest?.name,
        number: orderNumber,
        createdAt: fullD,
        cartTotal: cartTotal,
        completedAt: fullD,
        status: "new",
        AMFee: appyFee,
        tip: tip,
        tax: taxAmt,
        pickupChoice: isPickup ? "Pickup" : "Delivery",
        pickupTime: "",
        email: orderTempUserEmail,
        restaurantEmail: tempRestEmail,
        orderDate: date,
        orderTime: currentTime,
        readyTime: "",
        preparingTime: "",
        completedTime: "",
        restLoc: updatedRest?.location,
        restViewport: updatedRest?.viewport,
        menuSelected: menuSelected,
        refundData: [],
        userPhoneNumber: phoneNumber,
        restaurantPhoneNumber: updatedRest?.phoneNumber,
        orderInfo: null, //stripe reponse goes here
        paymentIntent: null, //stripe payment intent ID and split from secret phrase. logic is in app
        taxPercent: parseFloat((taxRate / 100).toFixed(2)),
        tipPercent: selectedTip,
        rewardPoints: 0,
        discountTotal: 0,
        newUserDiscount: null,
        fanDiscount: null,
        rewardDiscount: null,
        deliveryAddress: deliveryAddress,
        deliveryQuote: deliveryQuote,
        deliveryType:
          isPickup === true ? null : (updatedRest?.deliveryType || updatedRest.delivery_type)?.type,
        trackRewardDiscount: null,
        newRest: null,
        doorDashInfo: doorDashInfo,
        expectedPickupTime: expectedPickupTime,
      };

      // Start Checkout

      const stripe = await stripePromise;

      try {
        // create a checkout session

        let useEmail = session?.user?.email
          ? session?.user?.email
          : orderTempUserEmail;

        //PUSH PENDING ORDER HERE

        const docRef = await doc(db, "pendingOrders", useEmail);

        await setDoc(
          docRef,
          {
            pendingOrder: order,
          },
          { merge: true }
        );

        let tempTip = parseFloat(tip.toFixed(2));
        let tempTax = parseFloat(taxAmt.toFixed(2));
        let tempDeliveryFee = parseFloat(deliveryQuote.toFixed(2));

        // Pass order object to Redux
        dispatch(setOrder(order));

        const checkoutSession = await axios.post(
          "api/create-checkout-session",
          {
            items: productData,
            email: useEmail,
            tip: tempTip,
            tax: tempTax,
            deliveryFee: tempDeliveryFee,
          }
        );

        //need to pass order obj to checkout screen

        // redirect user to stripe checkout
        const result: any = await stripe?.redirectToCheckout({
          sessionId: checkoutSession.data.id,
        });
        if (result?.error) {
          alert(result?.error.message);
        } else {
          // console.log("checkoutSession.data", checkoutSession.data);
          //push data for order.
        }
      } catch (err) {
        console.error("Error during checkout: ", err);
      }
    }
  };

  //functions for checkout logic

  const getTodaysDate = async () => {
    var todayDate = new Date();
    todayDate.setMinutes(
      todayDate.getMinutes() - todayDate.getTimezoneOffset()
    );
    // console.log("todayDate~~~~~~~~~~~~~", todayDate);
    let useDate = todayDate.toISOString().slice(0, 10);
    return useDate;
  };

  const getCurrentFullTimeTest = async () => {
    var todayDate = new Date();
    await todayDate.setMinutes(
      todayDate.getMinutes() - todayDate.getTimezoneOffset()
    );
    var easternTimeOffset = +5; // Eastern Time is 5 hours behind UTC time
    todayDate.setHours(todayDate.getHours() + easternTimeOffset);
    return todayDate;
  };

  const getCurrentTime = async () => {
    var todayDate = new Date();
    todayDate.setMinutes(
      todayDate.getMinutes() - todayDate.getTimezoneOffset()
    );
    var hours = todayDate.getUTCHours();
    var AmOrPm = hours >= 12 ? "pm" : "am";
    var minutes = todayDate.getMinutes();
    if (minutes < 10) {
      var adjustedMinutes = `0${minutes}`;
      var hoursFixed = hours > 12 ? hours % 12 : hours === 0 ? 12 : hours;
      var finalTime = hoursFixed + ":" + adjustedMinutes + " " + AmOrPm;
      // let useDate = todayDate.toISOString().slice(11, 16);
      return finalTime;
    } else {
      var hoursFixed = hours > 12 ? hours % 12 : hours;
      hoursFixed === 0 ? (hoursFixed = 12) : null;

      var finalTime = hoursFixed + ":" + minutes + " " + AmOrPm;
      return finalTime;
    }
  };

  const getExpectedWaitTime = async (mins: any) => {
    var todayDate = new Date();
    todayDate.setMinutes(
      todayDate.getMinutes() + parseInt(mins) - todayDate.getTimezoneOffset()
    );
    var hours = todayDate.getUTCHours();
    var AmOrPm = hours >= 12 ? "pm" : "am";
    var minutes = todayDate.getMinutes();
    if (minutes < 10) {
      var adjustedMinutes = `0${minutes}`;
      var hoursFixed = hours > 12 ? hours % 12 : hours === 0 ? 12 : hours;
      var finalTime = hoursFixed + ":" + adjustedMinutes + " " + AmOrPm;
      // let useDate = todayDate.toISOString().slice(11, 16);
      return finalTime;
    } else {
      var hoursFixed = hours > 12 ? hours % 12 : hours;
      hoursFixed === 0 ? (hoursFixed = 12) : null;

      var finalTime = hoursFixed + ":" + minutes + " " + AmOrPm;
      return finalTime;
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
        // TODO: Make sure this is backwards compatible with Postgres `restaurant.enable_open`
        if (res.isOpen === false) {
          setIsLoading(false);
          alert("Restaurant is currently closed");
          resolve(false);
        }
        // LAYER 2 - checking if rest is closed by open/closed boolean value
        else {
          let dateObject = new Date(currentTime);
          let tempHour = parseFloat(dateObject.getHours().toString());
          let tempMin = parseFloat(dateObject.getMinutes().toString());

          let tempTime;
          tempMin.toString().length === 1
            ? (tempTime = `${tempHour}0${tempMin}`)
            : (tempTime = `${tempHour}${tempMin}`);

          if (res.hours === "closed" || !isRestaurantHours(tempTime, res) || !isMenuHours(tempTime, res.menuHours)) {
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
              } else if (phoneNumber?.length === 0) {
                alert("Please fill out phone number field.");
                setIsLoading(false);
                resolve(false);
              } else if (name?.length === 0) {
                alert("Please fill out name field.");
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
              if (phoneNumber?.length === 0) {
                alert("Please fill out phone number field.");
                setIsLoading(false);
                resolve(false);
              } else if (name?.length === 0) {
                alert("Please fill out name field.");
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
    (rest.enableDelivery === true || rest.enable_delivery === true)
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
                        <FormatPrice
                          amount={parseFloat(
                            ((item.price * item.quantity) / 100).toFixed(2)
                          )}
                        />
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
            Place {isPickup ? "Pickup" : "Delivery"} Order |
            <FormatPrice amount={parseFloat((totalAmt / 100).toFixed(2))} />
          </button>
          <div className="w-full flex flex-col  border-b-[1px] border-b-zinc-200 pb-4">
            <div className="py-0 gap-2 flex flex-col ">
              {downloadAppMsg && (
                <div className="bg-primary text-white p-2 rounded-lg flex items-center justify-between gap-4 mb-2">
                  <Image
                    onClick={() => setAlertVisible(true)}
                    className="w-12 cursor-pointer"
                    src={download}
                    alt="download"
                  />

                  <p className="text-sm">
                    You are missing out on{" "}
                    <span className="font-semibold">
                      {parseFloat((totalAmt / 100).toFixed(0))}
                    </span>{" "}
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

          {/* download links if prompted */}
          {isAlertVisible && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg text-center">
                <h2 className="mb-4 text-lg font-semibold">
                  Download AppyMeal For
                </h2>
                <div className="flex gap-4 justify-center">
                  <a
                    href="https://apps.apple.com/us/app/appymeal/id6443683011"
                    className="px-4 py-2 text-primary rounded shadow"
                  >
                    iOS
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.zowen1.AppyMeal&hl=en_US&gl=US&pli=1"
                    className="px-4 py-2  text-primary rounded shadow"
                  >
                    Android
                  </a>
                </div>
                <button
                  onClick={() => setAlertVisible(false)}
                  className="mt-4 block mx-auto text-gray-700 hover:text-gray-900"
                >
                  Close
                </button>
              </div>
            </div>
          )}

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
            <p className="text-dark">Final Total</p>
            <p className="text-zinc-800 font-bold text-lg">
              <FormatPrice amount={parseFloat((totalAmt / 100).toFixed(2))} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPageComponent;
