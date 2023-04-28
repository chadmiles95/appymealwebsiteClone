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
import SearchBar from "./SearchBar";
import { Spacer } from "./Spacer";

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
    <div className=" bg-smoke flex flex-col justify-center items-center">
      <div className="justify-center items-center w-1/3 mt-8">
        <SearchBar />
      </div>
      <div className="py-6 px-4 grid grid-cols-4 gap-4 mt-2">
        {restaurantData.map((restaurant: Restaurant) => {
          return (
            <div
              key={restaurant.name}
              className="border-[1px] w-full h-full border-gray-200 mb-6 group shadow-md"
            >
              <div className="w-full h-64 overflow-hidden p-1 rounded-xl">
                <Image
                  className="w-full h-full object-cover group-hover:scale-105 rounded-xl"
                  width={200}
                  height={300}
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
                    className="  w-20 h-9 bg-primary text-white rounded-full flex gap-1 items-center justify-center hover:bg-muted duration-300"
                  >
                    <span>
                      <GoPlus />
                    </span>
                    Menu
                  </button>
                  {/* <Link
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
                    <button className="w-24 h-9 bg-white border-[1px] border-black text-black   rounded-full flex items-center justify-center gap-1 hover:bg-secondary hover:text-white duration-300">
                      Details
                    </button>
                  </Link> */}

                  <p className="text-lg font-semibold py-2">
                    {restaurant.name.substring(0, 25)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
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
