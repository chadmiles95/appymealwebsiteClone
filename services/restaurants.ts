import { doc, getDoc } from "firebase/firestore";
import { db } from "../pages/_app";
import { Restaurant } from "../type";
import { reformatRestaurant } from "../utilities/restaurants";

const setTimeForUse = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());

  const weekday = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];
  let tempDay = weekday[d.getDay()];

  let hour = d.getUTCHours();
  let minutes = d.getMinutes();

  let tempTime = parseFloat(
    `${hour.toString().padStart(2, "0")}${minutes.toString().padStart(2, "0")}`
  );
  return { tempDay, tempTime };
};

export const getRestaurantByName = async (name: string) => {
  const restaurantDoc = doc(db, "restaurants", name);
  const restaurantSnapshot = await getDoc(restaurantDoc);

  if (restaurantSnapshot.exists()) {
    const { tempDay, tempTime }: any = setTimeForUse();
    const restaurant: Partial<Restaurant> = {
      id: restaurantSnapshot.id,
      ...restaurantSnapshot.data(),
    };

    const data: Partial<Restaurant> = reformatRestaurant(restaurant, tempDay, tempTime);

    return data;
  } else {
    throw new Error("Restaurant does not exist");
  }
};
