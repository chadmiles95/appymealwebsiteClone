import React from "react";
import Restaurants from "../../components/Restaurants";
import Head from "next/head";

const RestaurantsPage = () => {
  return (
    <>
      <Head>
        <title>Appymeal.com | Restaurants Guide</title>
        <meta name="description" content="Restaurant delivery & pickup service" />
      </Head>
      <Restaurants />
    </>
  );
};

export default RestaurantsPage;
