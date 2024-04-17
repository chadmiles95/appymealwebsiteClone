// useFetchRestaurants.ts
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isRestaurantAndMenuOpen } from "@/components/RestaurantCard";
import { setRestaurants } from "./shoppersSlice";
import { reformatRestaurant } from "../utilities/restaurants";
import { searchRestaurantsByLocation } from "services/location";

const MAX_RESTAURANTS_PER_PAGE = 50;
const DEFAULT_LATITUDE = 33.7673021; // ATLANTA
const DEFAULT_LONGITUDE = -84.7151217; // ATLANTA

const formatAndFilterRestaurants = (restaurants: any, currentDayUTC: number, currentMilitaryTimeUTC: number) => restaurants
  .map((restaurant: any) => {
      const formatted = reformatRestaurant(restaurant, currentDayUTC, currentMilitaryTimeUTC);
      const isOpen = isRestaurantAndMenuOpen(currentMilitaryTimeUTC.toString(), formatted);
      return { ...formatted, isOpen };
  })
  .sort((a: any, b: any) => {
      // TODO: Make sure this is backwards compatible with Postgres `restaurant.enable_open`
      if (a.isOpen === b.isOpen) {
          return (b.fanCount || 0) - (a.fanCount || 0);
      } else {
          return a.isOpen ? -1 : 1;
      }
  });

const useFetchRestaurants = () => {
  const restaurantsFiltered = useSelector((state: any) => state.shopper.restaurantsFiltered);
  const restaurantsSearch = useSelector((state: any) => state.shopper.restaurantsSearch);
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
        const shouldUseFilteredList = restaurantsSearch?.selectedId || restaurantsFiltered?.length;

        if (shouldUseFilteredList && !restaurantsFiltered?.length) {
            return dispatch(setRestaurants([]));;
        }

        const restaurantSearchPromise = shouldUseFilteredList
            ? Promise.resolve(restaurantsFiltered)
            : searchRestaurantsByLocation({
                latitude: DEFAULT_LATITUDE,
                longitude: DEFAULT_LONGITUDE,
            });

        restaurantSearchPromise.then((restaurants: any) => {
            const sortedRestaurants = formatAndFilterRestaurants(restaurants, tempDay, tempTime);

            dispatch(setRestaurants(sortedRestaurants));
        });
    } catch (error) {
        console.error("Error fetching restaurants:", error);
    }
    };

    retrieveRestaurants();
  }, [dispatch, restaurantsFiltered, restaurantsSearch?.selectedId]);

  return {};
};

export default useFetchRestaurants;
