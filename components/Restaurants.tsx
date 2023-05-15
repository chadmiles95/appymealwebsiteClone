// components/Restaurants.tsx
import React, { useState, useEffect } from "react";
import { Restaurant } from "../type";
import Image from "next/image";
import { GoPlus } from "react-icons/go";
import { BsStarFill } from "react-icons/bs";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { db } from "../pages/_app";
import { collection, onSnapshot } from "firebase/firestore";
import SearchBar from "./SearchBar";
import { Spacer } from "./Spacer";
import RestaurantCard from "./RestaurantCard";
import useFetchRestaurants from "../redux/useFetchRestaurants ";

type RestaurantsProps = {
  // If you have any props, you can define their types here
};

console.log("page trigs");

const Restaurants: React.FC<RestaurantsProps> = () => {
  //custom hook to grab restaurants on render
  useFetchRestaurants();

  const restaurantData = useSelector((state: any) => state.shopper.restaurants);

  const dispatch = useDispatch();
  // const [restaurantData, setRestaurantData] = useState<Restaurant[]>([]);

  // useEffect(() => {
  //   const unsubscribe = onSnapshot(
  //     collection(db, "restaurants"),
  //     (snapshot) => {
  //       const restaurants: Restaurant[] = snapshot.docs.map((doc) => ({
  //         // Use the Restaurant interface here
  //         ...doc.data(),
  //         id: doc.id,
  //       })) as Restaurant[];
  //       setRestaurantData(restaurants);
  //     }
  //   );

  //   // Clean up the listener on component unmount
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  return (
    <div className=" bg-smoke flex flex-col flex-1 justify-center items-center">
      <div className="justify-center items-center w-1/3 mt-8">
        <SearchBar />
      </div>
      <div className="py-6 px-0 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-2 items-start justify-items-center">
        {restaurantData.map((restaurant: Restaurant) => {
          return (
            <RestaurantCard key={restaurant.name} restaurant={restaurant} />
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
