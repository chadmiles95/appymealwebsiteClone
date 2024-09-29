import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import { CircleLogo } from "../public/assets/images/index";
import { AiOutlineHeart, AiOutlineUser } from "react-icons/ai";
import { BsCart2 } from "react-icons/bs";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useSession, signIn, signOut } from "next-auth/react";
import { addUser, removeUser, setRestaurantsFiltered } from "../redux/shoppersSlice";
import { searchRestaurantsByLocation } from "../services/location";

const useCurrentDevicePermissions = (permissionName: PermissionName) => {
  const dispatch = useDispatch();
  const [permission, setPermission] = useState(null as any);
  
  useEffect(() => {
    let ignore = false;
    navigator.permissions.query({ name: permissionName }).then((perm) => {
      if (!ignore) {
        setPermission(perm);
      }
    });

    return () => {
      ignore = true;
    }
  }, [permissionName]);

  useEffect(() => {
    if(!permission) return;
    
    const changeHandler = (e: any) => setPermission(e.target);
    
    permission.addEventListener('change', changeHandler);
  
    return () => {
      permission.removeEventListener('change', changeHandler);
    };
  }, [permission]);
    
  return permission;
};


const Navbar = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const productData = useSelector((state: any) => state.shopper.productData);
  const userInfo = useSelector((state: any) => state.shopper.userInfo);
  const [totalAmt, setTotalAmt] = useState(0);
  const [userLocation, setUserLocation] = useState({ longitude: null, latitude: null })

  const permission = useCurrentDevicePermissions('geolocation');

  const handleLocation = ({
    coords: {
        latitude,
        longitude,
    },
  }: any) => {
    setUserLocation({
      latitude,
      longitude,
    });
  };
  
  const handleLocationError = (err: any) => {
    console.log(err);
  };

  useEffect(() => {
    console.log(`geolocation permission status: ${permission?.state}`)
    if (permission?.state === 'granted' || permission?.state === 'prompt') {
      navigator.geolocation.getCurrentPosition(handleLocation, handleLocationError, {
        timeout: 30 * 1000,
      });
    }
  }, [permission?.state])

  useEffect(() => {
    if (userLocation?.latitude && userLocation?.longitude) {
      console.log('User Location:', userLocation);
      searchRestaurantsByLocation({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      }).then((nearbyRestaurants) => {
        dispatch(setRestaurantsFiltered(nearbyRestaurants))
      }).catch((err) => {
        console.log(err);
      })
    }
  }, [userLocation, dispatch]);

  useEffect(() => {
    if (session) {
      dispatch(
        addUser({
          name: session.user?.name,
          email: session.user?.email,
          image: session.user?.image,
        })
      );
    } else {
      dispatch(removeUser());
    }
  }, [session, dispatch]);

  useEffect(() => {
    let price = 0;
    productData.map((item: any) => {
      price += item.price * item.quantity;
      return price;
    });
    let usePrice = parseFloat(price.toFixed(2));
    setTotalAmt(usePrice);
  }, [productData]);

  return (
    <div className="w-full bg-secondary text-white sticky top-0 z-50 ">
      <div className="w-full ">
        <div className="max-w-Container h-20 mx-0 md:mx-auto px-0 md:px-4 flex items-center justify-between gap-2">
          {/* LOGO */}
          
          <Link href="/">
            <div className="navBarHover ">
              
              <span className="">
                <p className="font-semibold text-sm md:text-xl text-dark">
                  Restaurant 
                </p>
              </span>
              
              
            </div>
          </Link>
          <div></div>
          
          
          <div>
            <div></div>
          </div>
          <div className="h-10 flex flex-1 "></div>
          <div></div>
        
          
          
          
         
          <div  className=" max-w-contentContainer  gap-6 mr-4 md:mt-0 hidden lg:block">
          <Link href="/restaurants/Adriatic Grill">
          <button className=" animated-bg px-2 h-9   text-dark    flex items-center justify-center gap-1  hover:text-white duration-300  bg-smoke   ">
          
          
          <p className="">Menu</p>
          </button>
          </Link>
          <Link href="/restaurants/Adriatic Grill">
          <button className=" animated-bg px-2 h-9   text-dark    flex items-center justify-center gap-1  hover:text-white duration-300  bg-smoke   ">
          
          
          <p className="">Order Online</p>
          </button>
          </Link>
          <Link href="/restaurants/Adriatic Grill">
          <button className="bg-smoke animated-bg px-2 h-9   text-dark    flex items-center justify-center gap-1 hover:bg-dark hover:text-white duration-300 ">
          <p >Catering</p>
          </button>
          </Link>
          <Link href="/restaurants/Adriatic Grill">
          <button className="bg-smoke  animated-bg px-2 h-9   text-dark    flex items-center justify-center gap-1 hover:bg-dark hover:text-white duration-300 ">
          <p >Loyalty</p>
          </button>
          </Link>
          <Link href="/Contact">
          <button className="bg-smoke  animated-bg px-2 h-9   text-dark    flex items-center justify-center gap-1 hover:bg-dark hover:text-white duration-300 ">
          <p >Contact</p>
          </button>
          </Link>
          </div>

          {/* account starts here */}
          {userInfo ? (
            <div onClick={() => signOut()} className="navBarHover">
              <Image
                width={500}
                height={500}
                className="w-6 md:w-10  rounded-full object-cover color-dark"
                src={userInfo.image}
                alt="userImage"
              />
              <div>
                <p className="text-xs text-dark mb-1 md:mb-0">Sign Out</p>
                <h2 className="text-base font-semibold -mt-1 text-dark text-sm md:text-l">
                  {userInfo.name}
                </h2>
              </div>
            </div>
          ) : (
            <div onClick={() => signIn()} className="navBarHover">
              <AiOutlineUser className="text-lg text-dark" />
              <div>
                <p className="text-xs text-dark">Sign In</p>
                <h2 className="text-base font-semibold -mt-1 text-dark">
                  Account
                </h2>
              </div>
            </div>
          )}

          <Link href="/cart">
            <div className="flex flex-col justify-center items-center gap-2 h-14 px-5 rounded-full bg-transparent hover:bg-lightdark duration-300 relative">
              <BsCart2 className="text-2xl text-dark" />

              <span className="absolute w-4 h-4 bg-dark text-white top-2.5 right-4 rounded-full flex items-center justify-center font-bodyFont text-xs">
                {productData.length > 0 ? productData.length : 0}
              </span>
            </div>
          </Link>
        </div>
      </div>
      {/* <NavBarBottom /> */}
    </div>
  );
};

export default Navbar;
