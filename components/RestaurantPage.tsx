import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { Spacer } from "./Spacer";
import Image from "next/image";
import { PopupModal } from "./PopupModal";
import { useDispatch, useSelector } from "react-redux";
import useUpdateTime from "../redux/useUpdateTime";
import { useRouter } from "next/router";
import { PopupModalNew } from "./PopupModalNew";
import { Toaster } from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { deleteItem } from "redux/shoppersSlice";
import HourDisplay from "./HoursDisplay";
import OpenStatus from "./OpenStatus";
import { FaCarSide } from "react-icons/fa";
import { FaStore } from "react-icons/fa";
import { FaCaretRight } from "react-icons/fa";
import { FaCaretLeft } from "react-icons/fa";
import { colors } from "@/infastructure/theme/colors";
import { isRestaurantAndMenuOpen } from "./RestaurantCard";
import { fries } from "../public/assets/images/index";



interface MenuItemProps {
  name: string;
  description: string;
  price: number;
}

interface RestaurantPageProps {
  restaurant: any; // You can replace 'any' with the appropriate type for a restaurant
}

export const RestaurantPage: React.FC<RestaurantPageProps> = ({
  restaurant,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemProps>();
  const [currentlyOpen, setCurrentlyOpen] = useState<boolean>(false);
  const [totalAmt, setTotalAmt] = useState(0);

  //   GET LAST PAGE URL FOR BACK BUTTON
  const lastURL = useSelector((state: any) => state.shopper.lastVisitedPage);
  const cart = useSelector((state: any) => state.shopper.productData);
  const currentRest = useSelector(
    (state: any) => state.shopper.currentRestaurant
  );
  const router = useRouter();
  const dispatch = useDispatch();

  //   GET THE CURRENT TIME AND UPDATES IT IN REDUX
  const militaryTime = useSelector((state: any) => state.shopper.militaryTime);
  const updateTime = useUpdateTime();
  

  useEffect(() => {
    updateTime();
  }, []);

  //   SET RESTAURNAT OPEN/CLOSED DEPENDING ON TIME, MENU & MASTER TOGGLE
  useEffect(() => {
    const isRestOpen = isRestaurantAndMenuOpen(militaryTime, restaurant);
    setCurrentlyOpen(isRestOpen);
  }, [militaryTime, restaurant]);

  const handleMenuItemClick = (item: MenuItemProps) => {
    setSelectedMenuItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedMenuItem(undefined);
    setModalOpen(false);
  };

  const handleBackButtonClick = () => {
    if (lastURL) {
      router.push(lastURL);
    } else {
      // If there's no last visited page, navigate to a default page or handle this case as needed
      router.push("/restaurants");
    }
  };

  useEffect(() => {
    let price = 0;
    cart.map((item: any) => {
      price += item.price * item.quantity;
      return price;
    });
    let usePrice = parseFloat(price.toFixed(2));
    setTotalAmt(usePrice);
  }, [cart]);

  const formatTime = (time: string) => {
    const startTime = time.substring(0, 2) + ":" + time.substring(2, 4);
    const endTime = time.substring(5, 7) + ":" + time.substring(7, 9);

    // console.log(startTime, "startTime");
    // console.log(endTime, "endTime");

    const formattedStartTime = new Date(
      "1970-01-01T" + startTime + ":00Z"
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const formattedEndTime = new Date(
      "1970-01-01T" + endTime + ":00Z"
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return formattedStartTime + " - " + formattedEndTime;
  };

const [showLeftButton, setShowLeftButton] = useState(false);
const [showRightButton, setShowRightButton] = useState(true);

const [isSticky, setIsSticky] = useState(false);
const stickyMenuRef = useRef<HTMLDivElement>(null);
const menuSectionRefs = useRef<HTMLDivElement[]>([]);

const scrollableRef = useRef<HTMLDivElement>(null);

// Function to scroll to a category section
const handleScroll = () => {
  const scrollableElement = scrollableRef.current;
  if (scrollableElement) {
    const { scrollLeft, scrollWidth, clientWidth } = scrollableElement;
    const isScrolledToStart = scrollLeft === 0;
    const isScrolledToEnd = scrollLeft === scrollWidth - clientWidth;

    setShowLeftButton(!isScrolledToStart);
    setShowRightButton(!isScrolledToEnd);
  }
};
useEffect(() => {
  const scrollableElement = scrollableRef.current;
  if (scrollableElement) {
    scrollableElement.addEventListener('scroll', handleScroll);
    return () => {
      scrollableElement.removeEventListener('scroll', handleScroll);
    };
  }
}, []);

const scrollLeft = () => {
  if (scrollableRef.current) {
    scrollableRef.current.scrollBy({
    left: -300, // Adjust the scroll distance as needed
      behavior: 'smooth',
});
}
};

  const scrollRight = () => {
    if (scrollableRef.current) {
    scrollableRef.current.scrollBy({
    left: 300, // Adjust the scroll distance as needed
      behavior: 'smooth',
});
}
};


function StickyHeader() {
  
useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const triggerPixels = 700;
      setIsSticky(scrollTop > triggerPixels );

      // Stick when the user has scrolled more than 70% of the way down
       // Adjust the factor as needed
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
}
StickyHeader()
const [searchTerm, setSearchTerm] = useState('');

const handleSearch = (event) => {
  setSearchTerm(event.target.value);
};
 return (
  
    
    <div className=" w-full h-full flex-1 bg-primary  ">
     
       
      {/* TOP NAVBAR FOR RESTAURANTS */}
     
      
    
      <div className="  max-w-full h-full flex flex-row flex-wrap lg:flex-nowrap  py-12   ">
        <div className=" max-w-full basis-full lg:basis-2/3 lg:flex-1 flex-auto flex flex-col px-4 lg:px-16 overflow-x-hidden ">
        <h1 className=" text-dark text-center px-36 text-5xl mb-10 font-extrabold">Menu</h1>
        <p className="  text-dark text-center lg:px-32 xs:px-6 md:translate-x-0  md:w-full sm:w-screen sm:-translate-x-6  ">{restaurant.desc || restaurant.description}</p>
          
          {/* restaurant photos extra */}
          <div className=" mt-12    flex flex-row  w-full overflow-x-scroll md:overflow-x-auto  md:flex-wrap   ">
            {restaurant.images.map((image: string) => {
              return (
                <div
                  key={image.substring(15)}
                  className=" flex-none md:flex-auto justify-center my-2 md:w-1/2 xl:w-1/3 h-80 lg:h-60 overflow-hidden  "
                >
                  <div className="   rounded-xl overflow-hidden h-full mx-4  ">
                    <Image
                      src={image}
                      width={300}
                      height={300} // Adjust this to the desired height
                      alt="restaurantLogo"
                      className=" rounded-xl object-cover h-full overflow-hidden hover:scale-105"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* MENU ITEMS START*/}

          <button
          className= {`  top-1/2    -translate-y-1/2  w-8 h-8  "   
            ${isSticky && !modalOpen ? ' fixed z-30 top-24 translate-y-2 left-10 md:left-0 sm:left-0 ' :
               'xl:ml-10 sm:-ml-0 z-20   xl:-translate-x-20 translate-y-16 '} 
              ${Object.entries(restaurant.menus).length > 10 && showLeftButton && !modalOpen ? " " : "hidden"}`}
               onClick={scrollLeft}
        >
         <FaCaretLeft size={30}  />
        </button>
        <div className={`  ${showLeftButton ? "hidden" : "w-8 h-8"}`}></div>
        <button
          className= {`    top-1/2    -translate-y-1/2  w-8 h-8 items-center justify-center   "   
            ${isSticky && !modalOpen ? '   fixed ml-auto z-30 top-28 mt-2 xl:transform   xl:right-0 lg:right-0 md:right-0 sm:right-0  ' 
              : '  xl:translate-x-16 md:translate-x-0 z-20 flex  ml-auto translate-y-9  '}
             ${Object.entries(restaurant.menus).length > 11  && showRightButton && !modalOpen ? " " : " hidden"}`}

              onClick={scrollRight}
        >
          <FaCaretRight size={30}  />
          
        </button>  
        <div className={`  ${showRightButton ? "hidden " : "w-8 h-8  "}`}></div> {/* Placeholder for right arrow */}
    
     <div   ref={scrollableRef}  className = {`  py-2 flex flex-2 border-b-[1px] border-b-dark xl:text-lg lg:text-small md:text-small sm:text-xs overflow-x-hidden bg-primary  
      ${isSticky && !modalOpen ? 'left-0 xl:-ml-0 lg:-ml-0 fixed z-10 w-screen top-20  ' 
        : '  max-w-container md:max-w-screen overflow-y-hidden   mx-auto  -mt-10 '}  
      ${Object.entries(restaurant.menus).length < 6 ? 'justify-center gap-32  ' : 'items-center h-20 xl:justify-between md:justify-start'}`} >
          
          {/* clickable menu scroll links*/} 
          
          {Object.entries(restaurant.menus)
          
            .filter(([category]) => category !== "properties")
            .map(([category, index] ) => {
              const handleMenuLinkClick = (category: string) => {
                const targetSection = menuSectionRefs.current[category];
                console.log("Object.entries(restaurant.menus")
                if (targetSection) {
                  const sectionRect = targetSection.getBoundingClientRect();
                  const sectionTop = sectionRect.top;
                  const stickyMenuHeight = stickyMenuRef.current?.offsetHeight || 0;
              
                  // Calculate the offset to align the top of the section with the bottom of the sticky menu
                  const offset = sectionTop - stickyMenuHeight;
                  
              
                  // Adjust the scroll position to account for the sticky menu height
                  
                 if (isSticky){
                  scrollToWithDuration(offset -100, 500);

                 }
                    else{
                      scrollToWithDuration(offset -230, 500);
                    }
                    
                  
                }
              };
                

        
              const scrollToWithDuration = (targetOffset: number, duration: number) => {
                const startingY = window.pageYOffset;
                let start: number | null = null;
              
                const step = (timestamp: number) => {
                  if (!start) start = timestamp;
                  const time = timestamp - start;
                  const percent = Math.min(time / duration, 1);
                  window.scrollTo(0, startingY + targetOffset * percent);
                  if (time < duration) {
                    window.requestAnimationFrame(step);
                  }
                };
              
                window.requestAnimationFrame(step);
              };
              return (
                
                <div key="searchBar" className = "  px-6 py-2">
                   
                <div key={category}  className="  xl:text-lg lg:text-small md:text-small sm:text-xs hover:scale-105 hover:underline items-center justify-center overflow-hidden">
                    <button 
                    className="text-center font-semibold xl:text-sm lg:text-sm md:text-sm sm:text-xs text-dark"
                    onClick={() => handleMenuLinkClick(category)}
                  >
                   <div className="">{category}</div>
                  </button>
                  
                </div>
                </div>
              
              );
            })}
            </div>
            

            <div>
      <div>
      <div className=" mt-4 text-center rounded-full text-black">
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={handleSearch}
          className={` "  placeholder-black duraction-200 shadow-md bg-third text-black text-base outline-none border-[1px] border-dark focus-visible:border-dark  px-4 py-3 
            rounded-full  focus:ring-1 focus:ring-dark mt-1"  
            ${isSticky && !modalOpen ? 'xl:bg-white lg:bg-white md:bg-white sm:bg-smoke xl:translate-y-2 lg:translate-y-2 md:translate-y-2 sm:-translate-y-3 xl:mr-extra-large xl:ml-extra-large md:mr-64 md:ml-64 sm:mr-2 sm:ml-2 xl:top-2 lg:top-2 md:top-2 sm:top-44  left-0 right-0   fixed z-40 ' : 'relative w-3/4 -mb-6 mt-6  '} `}
        />
      </div> 
      </div>      
           
      {Object.entries(restaurant.menus)
      .filter(([category, items]) =>
        items.some((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        )
.filter(([category]) => category !== "properties")

.map(([category, items, index]) => {
  
  const categoryProperties = restaurant.menus.properties.find(
    (property: any) => property.name === category
      );
  if (categoryProperties && !(categoryProperties.isShowing || categoryProperties.enable_showing)) {
    
    return null; // Skip the category if isShowing is false
  }
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
   <div 
    key={category} 
    ref={(el) => (menuSectionRefs.current[category] = el)} 
    id={`menu-section-${category}`} 
    className="  w-full mt-12 flex flex-col "
    >
      <p className="font-semibold text-xl text-dark mb-6    ">
       {category}
      </p>
      
      {filteredItems.length > 0 ? (
      
        <div className="   py-6 px-4 grid grid-cols-1 lg:grid-cols-2 gap-4  ">
          
        {filteredItems.map(
          (item: any) =>
            (item.isShowing || item.enable_showing) && (
              <div
                key={item.name}
                onClick={
                  item.isAvailable
                    ? () => handleMenuItemClick(item)
                    : undefined
                }
                className={` relative flex flex-col border w-full  border-lightdark border-solid h-32  rounded-xl bg-third px-4 py-2  ${
                  item.isAvailable
                    ? "hover:bg-smoke cursor-pointer duration-300"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {!item.isAvailable && (
                  <div
                    style={{ top: -1, right: -1 }}
                    className=" absolute bg-primary text-white px-2 py-0 rounded-bl-lg"
                  >
                    OUT
                  </div>
                )}
                
                <div className="h-1/4 flex-nowrap overflow-hidden"> 
                   <p className=" text-dark">{item.name}</p>
                </div>
                <div className="  h-2/4 py-1 overflow-hidden text-dark text-sm">
                  <p
                    className=" overflow-hidden -webkit-line-clamp-2"
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      lineHeight: "1.7",
                      padding: "0",
                      margin: "0",
                    }}
                  >
                    {item.desc}
                  </p>
                 
                </div>
                <div className="h-1/4 ">
                  <p className=" text-dark">
                    $
                    {new Intl.NumberFormat("en-US", {
                      style: "decimal",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(item.price)}
                  </p>
                  
                </div>
                </div>
              
            )
        )}
      </div>
      
      ): null}
      
    </div>
    
  );
})}
</div> 
{Object.entries(restaurant.menus)
  .filter(([category, items]) =>
    items.some((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )
  .filter(([category]) => category !== "properties")
  .every(([category, items]) => {
    const filteredItems = items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filteredItems.length === 0;
  }) && <div><p className="text-gray-500 text-4xl text-center mt-10 md:mb-20   ">Item not available</p></div>}

  </div>

           
        
        
        <div className="lgl:w-1/3 lg:w-2/5 md:w-3/4 sm:w-full mdl:w-1/2  flex flex-col mx-auto sm:px-4 md:px-2 lg:px-2 lgl:px-2 items-center lg:order-3 md:order-3 sm:order-3">
          <p className="text-xl font-semibold text-dark">Methods Available</p>
          <div className="w-full flex flex-row gap-4 justify-center items-center mt-4 ">
            <div className="flex flex-row gap-12">
              <FaStore size={50} color={colors.brand.primary} />
              {/* <div className="flex bg-primary w-36 h-auto justify-center items-center rounded-full py-1">
                <p className="text-white text-xl">Pickup</p>
              </div> */}

              {(restaurant.enableDelivery || restaurant.enable_delivery) && (
                <FaCarSide size={50} color={colors.brand.primary} />
                // <div className="flex bg-primary w-36 h-auto justify-center items-center rounded-full py-1">
                //   <p className="text-white text-xl">Delivery</p>
                // </div>
              )}
            </div>
          </div>

          {/* cart starts here - making cart sticky so users can see as they scroll */}
          <div className=" min-w-full mt-8 border-lightdark border-solid border rounded-xl w-full  items-center sticky top-44  md:order-3 bg-third shadow-lg shadow-secondary">
            <div className="px-8 py-4 border-b border-lightdark border-solid border-1 flex flex-row justify-between">
              <p className="font-semibold text-dark">Current Cart</p>
              <p className="font-semibold text-dark lg:mr-2">
                Total: $
                {new Intl.NumberFormat("en-US", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(parseFloat((totalAmt / 100).toFixed(2)))}
              </p>
            </div>
            <div className="px-8 py-2 whitespace-nowrap">
              {currentRest?.name !== "" && (
                <div
                  className="flex"
                  onClick={() => {
                    router.push(`restaurants/${restaurant.name}`);
                  }}
                >
                  <p className="font-semibold px-2 hover:text-lightdark duration-200 cursor-pointer text-dark">
                    {" "}
                    {currentRest?.name?.length > 28
                      ? currentRest?.name.substring(0, 28) + ".."
                      : currentRest?.name}
                  </p>
                </div>
              )}
              <div className="px-2 py-2 overflow-y-auto max-h-[50vh]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            ">
                <div className="grid grid-cols-3 gap-4 items-center mb-4">
                  <p className="underline underline-offset-2 decoration-dark decoration-1">
                    Items
                  </p>
                  <p className="underline underline-offset-2 decoration-dark decoration-1 text-center">
                    Quantity
                  </p>
                  <p className="underline underline-offset-2 decoration-dark decoration-1 text-right">
                    Price
                  </p>
                </div>
                {cart.map((item: any, index: number) => (
                  <div key={index} className="col-span-3 relative">
                    <div className="grid grid-cols-3 gap-0 items-center pb-2 relative">
                      <div className="relative w-full flex flex-row">
                        <div
                          onClick={() => dispatch(deleteItem(item.id))}
                          className="mr-1 text-base w-5 h-5 text-zinc-600 hover:bg-[#74767c] hover:text-white rounded-full flex items-center justify-center cursor-pointer duration-200"
                        >
                          <MdClose />
                        </div>
                        <div className="flex flex-wrap whitespace-normal">
                          <p className="text-dark text-sm">{item.item}</p>
                        </div>
                      </div>
                      <p className="text-dark text-center">{item.quantity}</p>
                      <p className="text-dark text-right">
                        $
                        {new Intl.NumberFormat("en-US", {
                          style: "decimal",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(
                          parseFloat(
                            ((item.price * item.quantity) / 100).toFixed(2)
                          )
                        )}
                      </p>
                    </div>
                    {item.modifiers &&
                      item.modifiers.some(
                        (modifier: any) => modifier !== null
                      ) && (
                        <div className=" overflow-x-auto relative top-0 left-0 px-2 py-0 space-x-1 flex flex-row max-w-full mb-2">
                          {item.modifiers.map((option: any, index: number) => {
                            if (option !== null) {
                              return (
                                <div
                                  key={index}
                                  className="flex items-center justify-center bg-primary rounded-full px-2 h-6 min-w-max whitespace-nowrap"
                                >
                                  <p className="text-white text-sm">{option}</p>
                                </div>
                              );
                            }
                          })}
                        </div>
                      )}
                  </div>
                ))}
              </div>
              <Link href="/cart" className="col-start-1 col-span-3 ">
                <button className="bg-fifth hover:bg-muted w-full mt-4 text-black h-10 rounded-full font-semibold duration-300 mb-2">
                  Continue To Cart
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {selectedMenuItem && (
        <PopupModalNew
          style={{ zIndex: 999 }}
          isOpen={modalOpen}
          closeModal={handleCloseModal}
          item={selectedMenuItem}
          rest={restaurant}
        />
      )}
      <Toaster
        reverseOrder={false}
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: "8px",
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </div>
    
  );
};

// <div className="px-2 py-2">
// <div className="justify-between flex flex-row pb-2">
//   <p className=" underline underline-offset-2 decoration-dark decoration-1">
//     Items
//   </p>
//   <p className="underline underline-offset-2 decoration-dark decoration-1">
//     Quantity
//   </p>
//   <p className="underline underline-offset-2 decoration-dark decoration-1">
//     Price
//   </p>
// </div>
// {cart.map((item: any) => (
//   <div
//     key={item.id}
//     className="justify-between flex flex-row pb-1"
//   >
//     <div
//       onClick={() => dispatch(deleteItem(item.id))}
//       className="absolute left-4 pt-0 mt-0 text-base w-5 h-5 text-zinc-600 hover:bg-[#74767c] hover:text-white rounded-full flex items-center justify-center cursor-pointer duration-200"
//     >
//       <MdClose />
//     </div>
//     <div className="w-16">
//       <p className="text-dark">
//         {item.item.length > 16
//           ? item.item.substring(0, 16) + "..."
//           : item.item}
//       </p>
//     </div>
//     <p className="text-dark">{item.quantity}</p>
//     <p className="text-dark">
//       $
//       {new Intl.NumberFormat("en-US", {
//         style: "decimal",
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       }).format(item.price * item.quantity)}
//     </p>
//   </div>
// ))}
// {/* <div className="justify-between flex flex-row pb-1 pt-8"> */}
// <Link
//   href="/cart"
//   className="justify-between flex flex-row pb-1 pt-8"
// >
//   <button className="bg-primary hover:bg-muted w-full text-white h-10 rounded-full font-semibold duration-300">
//     Checkout
//   </button>
// </Link>
// {/* </div> */}
// </div>
