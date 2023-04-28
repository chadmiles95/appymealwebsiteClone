import React from "react";
import { useRouter } from "next/router";

const RestaurantDetailsPage = () => {
  const router = useRouter();
  const { restaurantname } = router.query;

  console.log("restaurantname", restaurantname);

  return <div>[restaurantname]</div>;
};

export default RestaurantDetailsPage;
