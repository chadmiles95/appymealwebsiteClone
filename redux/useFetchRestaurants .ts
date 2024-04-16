// useFetchRestaurants.ts
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isMenuHours, isRestaurantAndMenuOpen } from "@/components/RestaurantCard";
import { setRestaurants } from "./shoppersSlice";
import { onSnapshot, collection, where, query, limit } from "firebase/firestore";
import { db } from "../pages/_app";
import { Restaurant } from "../type";
import { reformatRestaurant } from "../utilities/restaurants";

const MAX_RESTAURANTS_PER_PAGE = 50;

const useFetchRestaurants = () => {
  const restaurantsFiltered = useSelector((state: any) => state.shopper.restaurantsFiltered);
  const restaurantSearch = useSelector((state: any) => state.shopper.restaurantsSearch);
  const dispatch = useDispatch();

  const setTimeForUse = () => {
    return new Promise<{ tempDay: string; tempTime: number }>(
      (resolve, reject) => {
        const d = new Date();
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());

        const weekday = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];
        let tempDay = weekday[d.getDay()];

        let hour = d.getUTCHours();
        let minutes = d.getMinutes();

        let tempTime = parseFloat(
          `${hour.toString().padStart(2, "0")}${minutes
            .toString()
            .padStart(2, "0")}`
        );
        resolve({ tempDay, tempTime });
      }
    );
  };

  useEffect(() => {
    const retrieveRestaurants = async () => {
      try {
        const { tempDay, tempTime }: any = await setTimeForUse();
        const shouldUseFilteredList = restaurantSearch?.selectedId || restaurantsFiltered?.length;

        if (shouldUseFilteredList && !restaurantsFiltered?.length) {
          return dispatch(setRestaurants([]));;
        }

        let restaurantsQuery = shouldUseFilteredList
          ? query(collection(db, "restaurants"), where('id', 'in', restaurantsFiltered.filter((r: any) => r.id).map((r: any) => r.id)))
          : query(collection(db, "restaurants"), limit(MAX_RESTAURANTS_PER_PAGE + 1));

        const unsubscribe = onSnapshot(
          restaurantsQuery,
          (snapshot) => {
            const tempRestaurants: Partial<Restaurant>[] = [];

            snapshot.docs
              .map(
                (doc) =>
                  ({
                    ...doc.data(),
                    id: doc.id,
                  } as Restaurant)
              )
              .forEach((restaurant: Restaurant) => {
                const data: Partial<Restaurant> = reformatRestaurant(restaurant, tempDay, tempTime);

                if (data.isShowing || data.enable_showing) {
                  tempRestaurants.push(data);
                }
              });

            // Sort the restaurants by open/closed and fanCount
            const sortedRestaurants = tempRestaurants
              .map((restaurant) => {
                const isOpen = isRestaurantAndMenuOpen(tempTime.toString(), restaurant);

                return { ...restaurant, isOpen };
              })
              .sort((a, b) => {
                // TODO: Make sure this is backwards compatible with Postgres `restaurant.enable_open`
                if (a.isOpen === b.isOpen) {
                  return (b.fanCount || 0) - (a.fanCount || 0);
                } else {
                  return a.isOpen ? -1 : 1;
                }
              });

            dispatch(setRestaurants(sortedRestaurants));
          }
        );

        return () => {
          if (unsubscribe) {
            unsubscribe();
          }
        };
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    retrieveRestaurants();
  }, [dispatch, restaurantsFiltered]);

  return {};
};

export default useFetchRestaurants;
