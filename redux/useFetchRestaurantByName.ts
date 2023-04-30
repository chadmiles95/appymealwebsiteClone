import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { addRestaurant } from "./shoppersSlice";
import { db } from "../pages/_app";
import { doc, getDoc } from "firebase/firestore";

const useFetchRestaurantByName = (name: string | string[] | undefined) => {
  console.log("useFetchRestaurantByName trigssssssss");
  console.log("name", name);
  const dispatch = useDispatch();
  const restaurants = useSelector((state: any) => state.shopper.restaurants);

  useEffect(() => {
    if (typeof name === "string") {
      const restaurantExists = restaurants.some(
        (restaurant: any) => restaurant.name === name
      );

      if (!restaurantExists) {
        const fetchRestaurant = async () => {
          const restaurantDoc = doc(db, "restaurants", name);
          const restaurantSnapshot = await getDoc(restaurantDoc);

          if (restaurantSnapshot.exists()) {
            const restaurantData = {
              id: restaurantSnapshot.id,
              ...restaurantSnapshot.data(),
            };
            dispatch(addRestaurant(restaurantData));
          }
        };

        fetchRestaurant();
      }
    }
  }, [name, dispatch, restaurants]);

  return useSelector((state: any) => {
    const restaurants = state.shopper.restaurants;
    return restaurants.find((restaurant: any) => restaurant.name === name);
  });
};

export default useFetchRestaurantByName;
