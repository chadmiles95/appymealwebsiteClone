import Head from "next/head";
import { Product, Restaurant } from "../type";
import LandingPage from "../components/LandingPage";

interface Props {
  productData: Product;
  restaurantData: Restaurant;
}

export default function Home({ productData }: Props) {
  return (
    <>
      <Head>
      
        <title>Appymeal.com | Order Now</title>
        <meta name="description" content="AppyMeal Online Ordering" />
      </Head>
      <main className=" flex-1 flex flex-col bg-primary">
        <div className="max-w-container mx-auto flex-1 flex flex-col bg-primary">
          <LandingPage />
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
