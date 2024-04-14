import React, { useState, useEffect } from "react";
import { isRestaurantOpen } from "./RestaurantCard";

interface Restaurant {
  [key: string]: any;
}

interface OpenStatusProps {
  restaurant: Restaurant;
  militaryTime: string;
}

const OpenStatus: React.FC<OpenStatusProps> = ({
  restaurant,
  militaryTime,
}) => {
  const [currentlyOpen, setCurrentlyOpen] = useState(false);

  // console.log("rest", restaurant);
  // console.log("militaryTime", militaryTime);

  useEffect(() => {
    const isRestOpen = isRestaurantOpen(restaurant, militaryTime);
    setCurrentlyOpen(isRestOpen);
  }, [restaurant, militaryTime]);

  return (
    <p className="text-sm md:text-lg text-dark">
      Status - {currentlyOpen ? "Open" : "Closed"}
    </p>
  );
};

export default OpenStatus;
