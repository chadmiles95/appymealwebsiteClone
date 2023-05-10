import React from "react";
import CartPageComponent from "../components/CartPageComponent";

const cart = () => {
  return (
    <div className="w-full flex-1 flex flex-col">
      <div className="max-w-contentContainer mx-auto flex-1 w-full">
        <CartPageComponent />
      </div>
    </div>
  );
};

export default cart;
