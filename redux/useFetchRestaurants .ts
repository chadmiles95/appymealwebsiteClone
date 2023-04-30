// useFetchRestaurants.ts
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setRestaurants } from "./shoppersSlice";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../pages/_app";
import { Restaurant } from "../type";

const useFetchRestaurants = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "restaurants"),
      (snapshot) => {
        const restaurants: Restaurant[] = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Restaurant[];

        dispatch(setRestaurants(restaurants));
      }
    );

    return () => {
      unsubscribe();
    };
  }, [dispatch]);
};

export default useFetchRestaurants;
