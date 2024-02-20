import "../styles/globals.scss";
import "slick-carousel/slick/slick.css";
import type { AppProps } from "next/app";
import { Open_Sans } from "next/font/google";
import Layout from "../components/Layout";
import { Provider, useDispatch } from "react-redux";
import { store, persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { SessionProvider } from "next-auth/react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  browserLocalPersistence,
  initializeAuth,
} from "firebase/auth";
import { ThemeProvider } from "../infastructure/ThemeProvider";
import { theme } from "../infastructure/theme";
import { MouseEventHandler, useCallback } from "react";
import { RESTAURANT_INPUT_ID } from "@/components/SearchBar";
import { setIsRestaurantsSearchResultsVisible } from "redux/shoppersSlice";

const open_sans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open_sans",
});

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

auth.setPersistence(browserLocalPersistence);

const Main = ({
  Component,
  pageProps: { session, ...pageProps },
}: any) => {
  const dispatch = useDispatch();
  const handleClickAway = useCallback((event: any) => {
    console.log(event.target?.id);
    if (event.target?.id !== RESTAURANT_INPUT_ID) {
      dispatch(setIsRestaurantsSearchResultsVisible(false));
    }
  }, [dispatch])

  return (
    <main
      className={`${open_sans.variable} font-sans flex flex-col`}
      style={{ minHeight: "100vh" }}
      onClick={handleClickAway}
    >
      <ThemeProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </main>
  );
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  // adding track last page

  // const router = useRouter();
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const handleRouteChange = (url: string) => {
  //     dispatch(setLastVisitedPage(url));
  //   };

  //   router.events.on("routeChangeComplete", handleRouteChange);

  //   return () => {
  //     router.events.off("routeChangeComplete", handleRouteChange);
  //   };
  // }, [dispatch, router]);

  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <PersistGate loading={"loading"} persistor={persistor}>
          <Main
            Component={Component}
            pageProps={{
              session,
              ...pageProps,
            }}
          />
        </PersistGate>
      </SessionProvider>
    </Provider>
  );
}
