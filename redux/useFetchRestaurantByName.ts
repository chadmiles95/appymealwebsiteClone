import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getRestaurantByName } from "services/restaurants";
import { addRestaurant, addOrReplaceRestaurant } from "./shoppersSlice";
import { db } from "../pages/_app";
import { doc, getDoc } from "firebase/firestore";
import { Restaurant } from "../type";
import { reformatRestaurant } from "../utilities/restaurants";

const useFetchRestaurantByName = (name: string | string[] | undefined) => {
  const dispatch = useDispatch();
  const restaurants = useSelector((state: any) => state.shopper.restaurants);
  const [usedName, setUsedName] = useState<string | null>(null);

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
    if (typeof name === "string") {
      const restaurantExists = restaurants.some(
        (restaurant: any) => restaurant.name === name
      );

      const fetchRestaurant = async () => {
        if (!restaurantExists && usedName !== name) {
          setUsedName(name);
          const restaurantDoc = doc(db, "restaurants", name);
          const restaurantSnapshot = await getDoc(restaurantDoc);

          if (restaurantSnapshot.exists()) {
            const { tempDay, tempTime }: any = await setTimeForUse();
            const restaurant: Partial<Restaurant> = {
              id: restaurantSnapshot.id,
              ...restaurantSnapshot.data(),
            };

            const data: Partial<Restaurant> = reformatRestaurant(restaurant, tempDay, tempTime);

            dispatch(addRestaurant(data as Restaurant));
          }
        } else {
          if (usedName === name) {
            return;
          } else {
            setUsedName(name);
            let restaurantLatest = await getRestaurantByName(name);
            dispatch(addOrReplaceRestaurant(restaurantLatest as Restaurant));
          }
        }
      };
      fetchRestaurant();
    }
  }, [name, dispatch, restaurants]);

  return useSelector((state: any) => {
    const restaurants = state.shopper.restaurants;
    return restaurants.find((restaurant: any) => restaurant.name === name);
  });
};

export default useFetchRestaurantByName;
