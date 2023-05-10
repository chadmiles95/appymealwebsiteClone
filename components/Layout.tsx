import React, { Children, ReactElement } from "react";
import Navbar from "./Navbar";
import TopFooter from "./TopFooter";
import Footer from "./Footer";
import { useRouter } from "next/router"; // Add this import
import { useDispatch } from "react-redux"; // Add this import
import { useEffect, useRef } from "react"; // Add this import
import { setLastVisitedPage } from "../redux/shoppersSlice"; // Add

interface Props {
  children: ReactElement;
}

const LastVisitedPageTracker = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const previousUrl = useRef<string>("");

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (previousUrl.current !== "") {
        dispatch(setLastVisitedPage(previousUrl.current));
      }
      previousUrl.current = url;
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [dispatch, router]);

  return null;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      <LastVisitedPageTracker />
      {children}
      {/* <TopFooter /> */}
      <Footer />
    </>
  );
};

export default Layout;
