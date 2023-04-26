// components/Restaurants.tsx
import React, { useState, useEffect } from "react";
import { Restaurant } from "../type";
import Image from "next/image";
import { GoPlus } from "react-icons/go";
import { BsStarFill } from "react-icons/bs";
import Link from "next/link";
import { useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { db } from "../pages/_app";
import { collection, onSnapshot } from "firebase/firestore";

type RestaurantsProps = {
  // If you have any props, you can define their types here
};

console.log("page trigs");

const Restaurants: React.FC<RestaurantsProps> = () => {
  const dispatch = useDispatch();
  const [restaurantData, setRestaurantData] = useState<Restaurant[]>([]);

  console.log("restaurantData", restaurantData);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "restaurants"),
      (snapshot) => {
        const restaurants: Restaurant[] = snapshot.docs.map((doc) => ({
          // Use the Restaurant interface here
          ...doc.data(),
          id: doc.id,
        })) as Restaurant[];
        setRestaurantData(restaurants);
      }
    );

    // Clean up the listener on component unmount
    return () => {
      unsubscribe();
    };
  }, []);

  console.log(restaurantData);

  return (
    <div className="py-6 px-4 grid grid-cols-4 gap-4">
      {restaurantData.map((restaurant: Restaurant) => {
        return (
          <div
            key={restaurant.name}
            className="border-[1px] border-gray-200 mb-6 group"
          >
            <div className="w-full h-[350px] overflow-hidden p-1">
              <Image
                className="w-full h-full object-contain scale-100 group-hover:scale-105"
                width={300}
                height={250}
                src={restaurant.photo}
                alt="itemImage"
              />
            </div>
            {/* Description */}
            <div className="px-2 py-4 flex flex-col  justify-center">
              <div className="flex justify-between py-2">
                <button
                  onClick={
                    () => null
                    //go to individual restaurant page
                  }
                  className="w-20 h-9 bg-blue text-white rounded-full flex gap-1 items-center justify-center hover:bg-[#004f9a] duration-300"
                >
                  <span>
                    <GoPlus />
                  </span>
                  See Menu
                </button>
                <Link
                  href={{
                    pathname: `restaurants/${restaurant.name}`,
                    query: {
                      name: restaurant.name,
                      description: restaurant.desc,
                      photo: restaurant.photo,
                    },
                  }}
                  as={`restaurants/${restaurant.name}`}
                >
                  <button className="w-24 h-9 bg-white border-[1px] border-black text-black   rounded-full flex items-center justify-center gap-1 hover:bg-black hover:text-white duration-300">
                    Details
                  </button>
                </Link>
              </div>
              <div className="flex items-center gap-3 ">
                <p className="font-titleFont text-lg text-green-700 font-semibold">
                  Now $80.80
                </p>
                <p className="text-gray-500 line-through decoration-[1px]">
                  $80.80
                </p>
              </div>

              <p className="text-lg font-semibold py-2">
                {restaurant.name.substring(0, 25)}
              </p>
              <p className="text-base text-zinc-500">
                {restaurant.desc.substring(0, 80)}...
              </p>
              <div className="flex gap-2 items-center text-sm mt-2">
                <div className="flex text-sm gap-1">
                  <BsStarFill />
                  <BsStarFill />
                  <BsStarFill />
                  <BsStarFill />
                  <BsStarFill />
                  <p className=" text-zinc-500">25</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
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

export default Restaurants;
