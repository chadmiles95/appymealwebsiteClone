import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Spacer } from "./Spacer";
import Image from "next/image";
import { PopupModal } from "./PopupModal";
import { useDispatch, useSelector } from "react-redux";
import useUpdateTime from "../redux/useUpdateTime";
import { useRouter } from "next/router";
import { PopupModalNew } from "./PopupModalNew";
import { Toaster } from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { deleteItem } from "redux/shoppersSlice";
import HourDisplay from "./HoursDisplay";
import OpenStatus from "./OpenStatus";
import { FaCarSide } from "react-icons/fa";
import { FaStore } from "react-icons/fa";
import { colors } from "@/infastructure/theme/colors";

interface MenuItemProps {
  name: string;
  description: string;
  price: number;
}

interface RestaurantPageProps {
  restaurant: any; // You can replace 'any' with the appropriate type for a restaurant
}

export const RestaurantPage: React.FC<RestaurantPageProps> = ({
  restaurant,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemProps>();
  const [currentlyOpen, setCurrentlyOpen] = useState<boolean>(false);
  const [totalAmt, setTotalAmt] = useState(0);

  //   GET LAST PAGE URL FOR BACK BUTTON
  const lastURL = useSelector((state: any) => state.shopper.lastVisitedPage);
  const cart = useSelector((state: any) => state.shopper.productData);
  const currentRest = useSelector(
    (state: any) => state.shopper.currentRestaurant
  );
  const router = useRouter();
  const dispatch = useDispatch();

  //   GET THE CURRENT TIME AND UPDATES IT IN REDUX
  const militaryTime = useSelector((state: any) => state.shopper.militaryTime);
  const updateTime = useUpdateTime();

  //   SET RESTAURNAT OPEN/CLOSED DEPENDING ON TIME, MENU & MASTER TOGGLE
  useEffect(() => {
    if (
      typeof restaurant.hours === "undefined" ||
      restaurant?.menuStatus === false
    ) {
      setCurrentlyOpen(false);
    } else if (
      parseFloat(militaryTime) >
        parseFloat(restaurant?.hours?.substring(0, 4)) &&
      parseFloat(militaryTime) <
        parseFloat(restaurant?.hours?.substring(5, 9)) &&
      restaurant.isOpen === true &&
      (parseFloat(militaryTime) >
        parseFloat(restaurant?.menuHours?.substring(0, 4)) ||
        restaurant?.menuHours === "All Day") &&
      (parseFloat(militaryTime) <
        parseFloat(restaurant?.menuHours?.substring(5, 9)) ||
        restaurant?.menuHours === "All Day")
    ) {
      setCurrentlyOpen(true);
    } else {
      setCurrentlyOpen(false);
    }
  }, [militaryTime, restaurant]);

  const handleMenuItemClick = (item: MenuItemProps) => {
    setSelectedMenuItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedMenuItem(undefined);
    setModalOpen(false);
  };

  const handleBackButtonClick = () => {
    if (lastURL) {
      router.push(lastURL);
    } else {
      // If there's no last visited page, navigate to a default page or handle this case as needed
      router.push("/restaurants");
    }
  };

  useEffect(() => {
    let price = 0;
    cart.map((item: any) => {
      price += item.price * item.quantity;
      return price;
    });
    let usePrice = parseFloat(price.toFixed(2));
    setTotalAmt(usePrice);
  }, [cart]);

  const formatTime = (time: string) => {
    const startTime = time.substring(0, 2) + ":" + time.substring(2, 4);
    const endTime = time.substring(5, 7) + ":" + time.substring(7, 9);

    console.log(startTime, "startTime");
    console.log(endTime, "endTime");

    const formattedStartTime = new Date(
      "1970-01-01T" + startTime + ":00Z"
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const formattedEndTime = new Date(
      "1970-01-01T" + endTime + ":00Z"
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return formattedStartTime + " - " + formattedEndTime;
  };

  //   console.log(restaurant.menus.burgers[0]);

  return (
    <div className="w-full h-full flex-1">
      <div className="w-full h-12 lg:h-14 bg-white justify-center items-center flex flex-row flex-nowrap lg:sticky top-20 z-5">
        <div className="w-full justify-start px-10 basis-full lg:flx-basis-1/4 py-2 lg:py-0 ">
          <p
            onClick={() => {
              handleBackButtonClick();
            }}
            className="font-semibold  hover:text-lightdark duration-200  cursor-pointer text-dark w-10"
          >
            Back
          </p>
        </div>

        <div className="flex flex-col whitespace-nowrap items-center justify-center w-1/2 px-4">
          <div>
            <p className="font-semibold px-2 text-dark basis-full flx-basis-1/4 py-0 text-md">
              For Rewards & Discounts Download App
            </p>
          </div>
          <div className="flex flex-row">
            <Link
              href="https://apps.apple.com/us/app/appymeal/id6443683011"
              className="basis-full flx-basis-1/4  py-0"
            >
              <p className="font-semibold px-2 hover:text-lightdark duration-200 cursor-pointer text-dark">
                Download iOS
              </p>
            </Link>
            <Link
              href="https://play.google.com/store/apps/details?id=com.zowen1.AppyMeal&hl=en_US&gl=US"
              className="basis-full flx-basis-1/4  py-0"
            >
              <p className="font-semibold px-2 hover:text-lightdark duration-200 cursor-pointer text-dark">
                Download Android
              </p>
            </Link>
          </div>
        </div>
      </div>
      {/* TOP NAVBAR FOR RESTAURANTS */}
      <div className="bg-smoke w-full h-40  items-center flex pg-4 gap-2  px-4 lg:px-16 justify-between">
        <div className="flex items-center">
          <div className="justify-start">
            <Image
              src={restaurant.photo}
              width={125}
              height={125}
              alt="restaurantLogo"
              className="object-cover rounded-xl"
            />
          </div>
          <div className="justify-start pl-8 ">
            <p className="text-2xl font-semibold text-dark">
              {restaurant.name}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start">
          <p className="text-dark">
            {restaurant.address} {restaurant.city}, {restaurant.state}
          </p>
          <HourDisplay hours={restaurant.hours} />
          <OpenStatus restaurant={restaurant} militaryTime={militaryTime} />
        </div>
      </div>
      <div className="w-full h-full flex flex-row flex-wrap lg:flex-nowrap  py-12 ">
        <div className="basis-full lg:basis-2/3 lg:flex-1 flex-auto flex flex-col  px-4 lg:px-16">
          <p className="text-dark">{restaurant.desc}</p>
          {/* restaurant photos extra */}
          <div className="mt-12 flex flex-row w-full flex-wrap xl:flex-nowrap">
            {restaurant.images.map((image: string) => {
              return (
                <div
                  key={image.substring(15)}
                  className="basis-full flex justify-center my-2 md:basis-1/2 xl:basis-1/3 h-80 lg:h-60 overflow-hidden"
                >
                  <div className="rounded-xl overflow-hidden h-80 lg:h-60 mx-4">
                    <Image
                      src={image}
                      width={300}
                      height={60}
                      alt="restaurantLogo"
                      className="rounded-xl object-cover h-full overflow-hidden  hover:scale-105 "
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {/* MENU ITEMS START */}
          {Object.entries(restaurant.menus)
            .filter(([category]) => category !== "properties")
            .map(([category, items]) => (
              <div key={category} className="w-full mt-12 flex flex-col">
                <p className="font-semibold text-xl text-dark mb-6">
                  {category}
                </p>
                <div className="py-6 px-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {items.map((item: any) => (
                    <div
                      key={item.name}
                      onClick={() => handleMenuItemClick(item)}
                      className="flex flex-col w-full border border-lightdark border-solid h-32 rounded-xl bg-white px-4 py-2 hover:bg-smoke cursor-pointer duration-300"
                    >
                      <div className="h-1/4 flex-nowrap overflow-hidden">
                        <p className="text-dark">{item.name}</p>
                      </div>
                      <div className="h-2/4 py-1 overflow-hidden text-dark text-sm">
                        <p
                          className="overflow-hidden -webkit-line-clamp-2"
                          style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            lineHeight: "1.7",
                            padding: "0",
                            margin: "0",
                          }}
                        >
                          {item.desc}
                        </p>
                      </div>
                      <div className="h-1/4">
                        <p className="text-dark">
                          $
                          {new Intl.NumberFormat("en-US", {
                            style: "decimal",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
        <div className=" lgl:w-1/3 lg:w-2/5 sm:w-full md:w-3/4 mdl:w-1/2 flex flex-col mx-auto sm:px-4 md:px-2 lg:px-2 lgl:px-2 items-center">
          <p className="text-xl font-semibold text-dark">Methods Available</p>
          <div className="w-full flex flex-row gap-4 justify-center items-center mt-4">
            <div className="flex flex-row gap-12">
              <FaStore size={50} color={colors.brand.primary} />
              {/* <div className="flex bg-primary w-36 h-auto justify-center items-center rounded-full py-1">
                <p className="text-white text-xl">Pickup</p>
              </div> */}

              {restaurant.enableDelivery && (
                <FaCarSide size={50} color={colors.brand.primary} />
                // <div className="flex bg-primary w-36 h-auto justify-center items-center rounded-full py-1">
                //   <p className="text-white text-xl">Delivery</p>
                // </div>
              )}
            </div>
          </div>

          {/* cart starts here - making cart sticky so users can see as they scroll */}
          <div className="mt-8 min-w-full border-lightdark border-solid border rounded-xl w-full items-center sticky top-36">
            <div className="px-8 py-4 border-b border-lightdark border-solid border-1 flex flex-row justify-between">
              <p className="font-semibold text-dark">Current Cart</p>
              <p className="font-semibold text-dark lg:mr-2">
                Total: $
                {new Intl.NumberFormat("en-US", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(totalAmt)}
              </p>
            </div>
            <div className="px-8 py-2 whitespace-nowrap">
              {currentRest?.name !== "" && (
                <div
                  className="flex"
                  onClick={() => {
                    router.push(`restaurants/${restaurant.name}`);
                  }}
                >
                  <p className="font-semibold px-2 hover:text-lightdark duration-200 cursor-pointer text-dark">
                    {" "}
                    {currentRest?.name?.length > 28
                      ? currentRest?.name.substring(0, 28) + ".."
                      : currentRest?.name}
                  </p>
                </div>
              )}
              <div className="px-2 py-2 overflow-y-auto max-h-[50vh]">
                <div className="grid grid-cols-3 gap-4 items-center mb-4">
                  <p className="underline underline-offset-2 decoration-dark decoration-1">
                    Items
                  </p>
                  <p className="underline underline-offset-2 decoration-dark decoration-1 text-center">
                    Quantity
                  </p>
                  <p className="underline underline-offset-2 decoration-dark decoration-1 text-right">
                    Price
                  </p>
                </div>
                {cart.map((item: any, index: number) => (
                  <div key={index} className="col-span-3 relative">
                    <div className="grid grid-cols-3 gap-0 items-center pb-2 relative">
                      <div className="relative w-full flex flex-row">
                        <div
                          onClick={() => dispatch(deleteItem(item.id))}
                          className="mr-1 text-base w-5 h-5 text-zinc-600 hover:bg-[#74767c] hover:text-white rounded-full flex items-center justify-center cursor-pointer duration-200"
                        >
                          <MdClose />
                        </div>
                        <div className="flex flex-wrap whitespace-normal">
                          <p className="text-dark text-sm">{item.item}</p>
                        </div>
                      </div>
                      <p className="text-dark text-center">{item.quantity}</p>
                      <p className="text-dark text-right">
                        $
                        {new Intl.NumberFormat("en-US", {
                          style: "decimal",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(item.price * item.quantity)}
                      </p>
                    </div>
                    {item.modifiers &&
                      item.modifiers.some(
                        (modifier: any) => modifier !== null
                      ) && (
                        <div className="overflow-x-auto relative top-0 left-0 px-2 py-0 space-x-1 flex flex-row max-w-full mb-2">
                          {item.modifiers.map((option: any, index: number) => {
                            if (option !== null) {
                              return (
                                <div
                                  key={index}
                                  className="flex items-center justify-center bg-primary rounded-full px-2 h-6 min-w-max whitespace-nowrap"
                                >
                                  <p className="text-white text-sm">{option}</p>
                                </div>
                              );
                            }
                          })}
                        </div>
                      )}
                  </div>
                ))}
              </div>
              <Link href="/cart" className="col-start-1 col-span-3 ">
                <button className="bg-primary hover:bg-muted w-full mt-4 text-white h-10 rounded-full font-semibold duration-300 mb-2">
                  Continue To Cart
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {selectedMenuItem && (
        <PopupModalNew
          style={{ zIndex: 999 }}
          isOpen={modalOpen}
          closeModal={handleCloseModal}
          item={selectedMenuItem}
          rest={restaurant}
        />
      )}
      <Toaster
        reverseOrder={false}
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: "8px",
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </div>
  );
};

// <div className="px-2 py-2">
// <div className="justify-between flex flex-row pb-2">
//   <p className=" underline underline-offset-2 decoration-dark decoration-1">
//     Items
//   </p>
//   <p className="underline underline-offset-2 decoration-dark decoration-1">
//     Quantity
//   </p>
//   <p className="underline underline-offset-2 decoration-dark decoration-1">
//     Price
//   </p>
// </div>
// {cart.map((item: any) => (
//   <div
//     key={item.id}
//     className="justify-between flex flex-row pb-1"
//   >
//     <div
//       onClick={() => dispatch(deleteItem(item.id))}
//       className="absolute left-4 pt-0 mt-0 text-base w-5 h-5 text-zinc-600 hover:bg-[#74767c] hover:text-white rounded-full flex items-center justify-center cursor-pointer duration-200"
//     >
//       <MdClose />
//     </div>
//     <div className="w-16">
//       <p className="text-dark">
//         {item.item.length > 16
//           ? item.item.substring(0, 16) + "..."
//           : item.item}
//       </p>
//     </div>
//     <p className="text-dark">{item.quantity}</p>
//     <p className="text-dark">
//       $
//       {new Intl.NumberFormat("en-US", {
//         style: "decimal",
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       }).format(item.price * item.quantity)}
//     </p>
//   </div>
// ))}
// {/* <div className="justify-between flex flex-row pb-1 pt-8"> */}
// <Link
//   href="/cart"
//   className="justify-between flex flex-row pb-1 pt-8"
// >
//   <button className="bg-primary hover:bg-muted w-full text-white h-10 rounded-full font-semibold duration-300">
//     Checkout
//   </button>
// </Link>
// {/* </div> */}
// </div>
