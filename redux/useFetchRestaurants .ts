// useFetchRestaurants.ts
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isRestaurantOpen } from "@/components/RestaurantCard";
import { setRestaurants } from "./shoppersSlice";
import { onSnapshot, collection, where, query, limit } from "firebase/firestore";
import { db } from "../pages/_app";
import { Restaurant } from "../type";

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
            const tempRestaurants: Restaurant[] = [];

            snapshot.docs
              .map(
                (doc) =>
                  ({
                    ...doc.data(),
                    id: doc.id,
                  } as Restaurant)
              )
              .forEach((restaurant: Restaurant) => {
                const menus = restaurant.hours[tempDay]?.menus;
                let data = { ...restaurant, menuStatus: false };

                if (menus) {
                  const menuEntries = Object.entries(menus);

                  const menuLength = menuEntries.length;

                  menuEntries.forEach(([key, value], i) => {
                    if (
                      (parseFloat(tempTime) >
                        parseFloat((value as string).substring(0, 4)) &&
                        parseFloat(tempTime) <
                          parseFloat((value as string).substring(5, 9))) ||
                      value === "All Day"
                    ) {
                      data = {
                        ...data,
                        hours: restaurant.hours[tempDay]?.time,
                        menus: restaurant.menus[key],
                        menuSelected: key,
                        menuStatus: true,
                        menuHours: value as any,
                      };
                    } else if (
                      i === menuLength - 1 &&
                      data.menuStatus !== true &&
                      typeof data.hours[tempDay].menus !== "undefined"
                    ) {
                      data = {
                        ...data,
                        hours: data.hours[tempDay]?.time,
                        menus: data.menus[key],
                        menuSelected: key,
                        menuStatus: true,
                        menuHours: value as any,
                      };
                    }
                  });
                }
                if (data.isShowing || (data as any).enable_showing) {
                  tempRestaurants.push(data);
                }
              });

            // Sort the restaurants by open/closed and fanCount
            const sortedRestaurants = tempRestaurants
              .map((restaurant) => {
                const isOpen = isRestaurantOpen(restaurant, tempTime);

                return { ...restaurant, isOpen };
              })
              .sort((a, b) => {
                // TODO: Make sure this is backwards compatible with Postgres `restaurant.enable_open`
                if (a.isOpen === b.isOpen) {
                  return b.fanCount - a.fanCount;
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
