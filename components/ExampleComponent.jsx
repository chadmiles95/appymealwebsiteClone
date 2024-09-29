import React from 'react';


const ExampleComponent = () => {
  const AdriaticGrillconfig = {
    restaurantId: "123",
    name: {
        restaurantName: "Adriatic Grill"
    },
    theme: {
      primaryColor: "#FFFFFF",
      secondaryColor: "#180000",
      thirdColor: "#757575",
      fontFamily: "Roboto"
    },
    images: {
      logo: "/images/logo.png",
      banner: "/images/banner.png"
    },
    content: {
      welcomeText: "Welcome to The Adriatic Grill, serving a fusion of Southeastern European and American cuisine in a warm, family-friendly atmosphere.",
      aboutUs: "Since its establishment in 2012 in Lawrenceville, GA, The Adriatic Grill has been serving up a delightful fusion of Southeastern European and American cuisine. Known for its signature meals, including vibrant salads, delicious sandwiches, and authentic European cakes and desserts, this family-owned restaurant promises an unforgettable culinary experience. With its warm, inviting atmosphere and family-friendly prices, The Adriatic Grill is a must-visit for foodies and families alike, promising an irresistible taste of Mediterranean flair right in the heart of Gwinnett County."
    }
  };

  const handleSaveConfig = async () => {
    await saveConfig("124", config); // "123" is the restaurantId
  };

  return (
    <div>
      <button className = "bg-gray-400 " onClick={handleSaveConfig}>Save Config</button>
    

    </div>
    
    
  );
};

export default ExampleComponent;