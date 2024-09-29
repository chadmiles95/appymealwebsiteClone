import Image from "next/image";
import React, {useEffect, useRef, useState, useCallback} from "react";
import { useSelector } from 'react-redux';
import useFetchRestaurantByName from '../redux/useFetchRestaurantByName';
import { home_bg, italian, pizza, spaghetti, specials, club, sauce, catering, fries } from "../public/assets/images/index";
import { Spacer } from "./Spacer";
import Link from "next/link";
import config from '../config.json';
export const orderOnlyText = "Order Online";
import AdminDashboard from './AdminDashboard';

const LandingPage = ({ restaurantId }) => {
  const restaurant = useFetchRestaurantByName(restaurantId);
  const config = restaurant ? restaurant.config : {};
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [home_bg, spaghetti, pizza];

  const [adminMode, setAdminMode] = useState(false);

  const toggleAdminMode = () => {
    setAdminMode(!adminMode);
  };

  
  
  const handleNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % images.length;
    scrollToImage(nextIndex);
  }, [currentIndex, images.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext()
      
      
    }, 10000); // Change image every 5 seconds

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [handleNext]);

  const scrollToImage = (index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const containerWidth = window.innerWidth;

      setCurrentIndex(index);

      container.scrollTo({
        left: index * containerWidth,
        behavior: "smooth",
      });
    }
  };
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const containerWidth = window.innerWidth;
      const newIndex = Math.round(container.scrollLeft / containerWidth);

      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    }
  };
  return (
    
    <div className={"bg-primary"}>
       

    
    <div className=" h-ninetyPercent absolute left-0  bg-[#F1EDEE] font-titleFont">
      <div
        ref={scrollContainerRef}
        className=" overflow-hidden w-full h-full whitespace-nowrap  "
      >
        <div className="h-screen w-screen items-center justify-center scroll-snap-start relative inline-block ">
          
          <Image
            src={home_bg}
            alt="LandingPageImg"
            fill
            className = "object-cover"
          />
          <h1 className ="absolute bottom-24  w-full h-full flex flex-col items-center justify-center text-white text-8xl z-20 font-extrabold">Delicious Cuisine</h1>
          <p className ="absolute bottom-30 w-full h-full flex flex-col items-center justify-center text-white text-xl z-20 font-semibold">Try our new menu items </p>
          <div className ="absolute  inset-0 mt-32 mx-auto  flex justify-center items-center flex-col  text-white text-xl z-20 font-semibold ">
            <button className ="border-solid-2 border-primary border-[3px] px-4 py-1 hover:text-black hover:bg-primary font-semibold">Click </button>
            </div>
          
          
          <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
        </div>
        <div className="h-screen w-full  items-center justify-center scroll-snap-start relative inline-block ">
         
          <Image
            src={spaghetti}
            alt="LandingPageImg"
            fill
            className="object-cover "
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
           <h1 className ="absolute bottom-24 left-0 w-full h-full flex flex-col items-center justify-center text-white text-8xl z-20 font-extrabold">Delicious Cuisine</h1>
            <p className ="absolute bottom-30 w-full h-full flex flex-col items-center justify-center text-white text-xl z-20 font-semibold">Try our new menu items </p>
            <div className ="absolute  inset-0 mt-32 mx-auto  flex justify-center items-center flex-col  text-white text-xl z-20 font-semibold ">
            <button className ="border-solid-2 border-primary border-[3px] px-4 py-1 hover:text-black hover:bg-primary font-semibold ">Click </button>
            </div>
            
        </div>
        <div className="h-screen w-full  items-center justify-center scroll-snap-start relative inline-block ">
          
          <Image
            src={pizza}
            alt="LandingPageImg"
            fill
            className="object-cover "
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
          <h1 className =" absolute bottom-24 left-0 w-full h-full flex flex-col items-center justify-center text-white text-8xl z-20 font-extrabold">Delicious Cuisine</h1>
            <p className ="absolute bottom-30  w-full h-full flex flex-col items-center justify-center text-white text-xl z-20 font-semibold">Try our new menu items </p>   
            <div className ="absolute  inset-0 mt-32 mx-auto  flex justify-center items-center flex-col  text-white text-xl z-20 font-semibold ">
            <button className ="border-solid-2 border-primary border-[3px] px-4 py-1 hover:text-black hover:bg-primary font-semibold">Click </button>
            </div>      
        </div>
      </div>
      <div className="  mx-auto flex justify-center items-center w-96 rounded-t-xl h-16  space-x-4 bg-primary -mt-16 z-30 relative">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToImage(index)}
            className={`  w-4 h-4 rounded-full z-30 hover:bg-gray-700 ${
              currentIndex === index ? "bg-gray-700" : "bg-gray-500"
            }`}
          ></button>
        ))}
      </div>
     
    
      
      
    </div>
    <div className="mt-2 text-white text-3xl z-40 relative text-center">
        <h1> Open 9:00am - 6:00pm Mon-Sat</h1>
      </div>
      <div className="mt-2 text-white text-3xl z-40 relative text-center">
        <h1> 678-776-6767</h1>
      </div>
    <div className ="mt-96 flex flex-row mx-auto justify-center   overflow-hidden bg-primary px-96 pt-96 gap-40 ">
      
      <Image
            src={specials}
            alt="LandingPageImg"
            
            className="object-cover h-96 bg-primary mt-40 translate-y-20  "
            width={500}
            height={500}
          />
          
          
          <Image
            src={club}
            alt="LandingPageImg"
            width={500}
            height={500}
            
            className="object-cover  bg-primary mt-40 translate-y-20"
          />
    </div>

    <div className ="flex flex-row  mt-10 mx-20 mb-20">
    <div className ="flex  justify-center align-items flex-col text-black text-2xl  w-1/2">
        <h1 className ="text-center text-5xl font-extrabold">Specials</h1>
        <p className ="text-center text-lg mt-6  mx-auto px-20">
          Pitmaster Rob is always up to something! Check out our rotating specialty sandwiches and limited drops, including a Limited Time Only Monthly Chef's Special that will leave you craving for more!
        </p>
        <button className =" translate-y-8 border-solid-2 border-black border-[3px] mx-auto px-2 hover:text-primary hover:bg-black font-semibold ">Click </button>
      </div>
      <div className ="flex  justify-center align-items flex-col text-black text-2xl  w-1/2 ">
        <h1 className ="text-center text-5xl font-extrabold">Chef Box</h1>
        <p className = " text-lg text-center mt-6 px-20 mx-auto">
        Once a month, Chef & Pitmaster Rob Sonderman presents a new 4-course dine-in experience that goes beyond our regular offerings and puts a smoky spin on gourmet cuisine.
        </p>
        <button className =" translate-y-8 border-solid-2 border-black border-[3px] mx-auto px-2 hover:text-primary hover:bg-black font-semibold ">Click </button>
      </div>

    </div>


      <div className ="flex flex-row mt-32  w-screen  mx-auto -ml-52">
    <div className ="flex  justify-center align-items flex-col text-black text-2xl w-2/3 translate-x-40 ">
        <h1 className ="text-center text-5xl font-extrabold">Sauce Club</h1>
        <p className ="text-center text-lg mt-6  mx-auto px-20 w-1/2 ">
          Pitmaster Rob is always up to something! Check out our rotating specialty sandwiches and limited drops, including a Limited Time Only Monthly Chef's Special that will leave you craving for more!
        </p>
        <button className =" translate-y-8 border-solid-2 border-black border-[3px] mx-auto px-2 hover:text-primary hover:bg-black font-semibold ">Click </button>
      </div>
      <div className ="flex justify-end mx-auto flex-col text-black text-2xl  w-2/3   ">
      <Image
            src={sauce}
            alt="LandingPageImg"
            width={1000}
            height={1000}
            
            className="object-cover  bg-primary translate-x-40   "
          />
      </div>

    </div>
    <div className ="flex flex-row-reverse   w-screen  mx-auto -ml-52">
    <div className ="flex  justify-center align-items flex-col text-black text-2xl w-2/3 translate-x-40  ">
        <h1 className ="text-center text-5xl font-extrabold">Catering</h1>
        <p className ="text-center text-lg mt-6  mx-auto px-20 w-1/2 ">
          Pitmaster Rob is always up to something! Check out our rotating specialty sandwiches and limited drops, including a Limited Time Only Monthly Chef's Special that will leave you craving for more!
        </p>
        <button className =" translate-y-8 border-solid-2 border-black border-[3px] mx-auto px-2 hover:text-primary hover:bg-black font-semibold ">Click </button>
      </div>
      <div className ="flex justify-end mx-auto flex-col text-black text-2xl  w-2/3   ">
      <Image
            src={catering}
            alt="LandingPageImg"
            width={1000}
            height={1000}
            
            className="object-cover  bg-primary translate-x-40  "
          />
      </div>

    </div>
     


    </div>
   
    
  );
};

export default LandingPage;
