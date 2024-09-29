import React from "react";
import Contact from "../components/ContactPage";
import Head from "next/head";

const ContactPage = () => {
  return (
    <>
      <Head>
      
        <title>Appymeal.com | Restaurants Guide</title>
        <meta
          name="description"
          content="Restaurant delivery & pickup service"
        />
      </Head>
      <Contact/>
    </>
  );
};

export default ContactPage;
