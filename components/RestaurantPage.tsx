import React from "react";

interface RestaurantPageProps {
  restaurant: any; // You can replace 'any' with the appropriate type for a restaurant
}

export const RestaurantPage: React.FC<RestaurantPageProps> = ({
  restaurant,
}) => {
  return (
    <div>
      <p>{restaurant.id}</p>
      <p>{restaurant.id}</p>
      <p>{restaurant.id}</p>
      <p>{restaurant.id}</p>
    </div>
  );
};
