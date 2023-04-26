import Head from "next/head";
import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import { Product, Restaurant } from "../type";
import Products from "../components/Products";
import Footer from "../components/Footer";
import TopFooter from "../components/TopFooter";
import Restaurants from "../components/Restaurants";

interface Props {
  productData: Product;
  restaurantData: Restaurant;
}

export default function Home({ productData }: Props) {
  return (
    <>
      <Head>
        <title>Appymeal.com | Local Love</title>
        <meta name="description" content="AppyMeal Online Ordering" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/smallLogo.ico.png" />
      </Head>
      <main className="bg-lightBlue">
        <div className="max-w-contentContainer mx-auto bg-white">
          <Banner />
          <Products productData={productData} />
          <Restaurants />
        </div>
      </main>
    </>
  );
}

// ================== SSR data fetching start here ================
export const getServerSideProps = async () => {
  const productData = await (
    await fetch("http://localhost:3000/api/productsdata")
  ).json();

  return {
    props: { productData },
  };
};
