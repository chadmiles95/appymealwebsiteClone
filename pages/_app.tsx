import "../styles/globals.css";
import "slick-carousel/slick/slick.css";
import type { AppProps } from "next/app";
import { Open_Sans } from "next/font/google";
import Layout from "../components/Layout";
import { Provider } from "react-redux";
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

const open_sans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open_sans",
});

// console.log("KKEYYYYYYYYYYYyyyyyyyyyyyyyyyyyyyy", process.env.FIREBASE_API_KEY);

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

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <PersistGate loading={"loading"} persistor={persistor}>
          <main className={`${open_sans.variable} font-sans`}>
            <ThemeProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ThemeProvider>
          </main>
        </PersistGate>
      </SessionProvider>
    </Provider>
  );
}
