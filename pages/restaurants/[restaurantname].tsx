import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { RestaurantPage } from "../../components/RestaurantPage";
import useFetchRestaurantByName from "../../redux/useFetchRestaurantByName";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading";
import Head from "next/head";

const RestaurantDetailsPage = () => {
  const router = useRouter();
  const { restaurantname } = router.query;

  useFetchRestaurantByName(restaurantname);

  const restaurants = useSelector((state: any) => state.shopper.restaurants);
  const restaurant = restaurants.find((r: any) => r.name === restaurantname);

  return (
    <>
      <Head>
        <title>Appymeal.com | {restaurantname}</title>
        <meta name="description" content="Restaurant delivery & pickup service" />
      </Head>
      {
        restaurant ? <RestaurantPage restaurant={restaurant} /> : <Loading />
      }
    </>
  );
};

export default RestaurantDetailsPage;
