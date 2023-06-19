import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import React, { useContext } from "react";
import { db } from "../pages/_app";
import { host } from "./links";

export const getOrderNumber = async () => {
  // console.log("trigs2");
  const docRef = doc(db, "orders", "number");
  const docSnap = await getDoc(docRef);
  let total_count = docSnap?.data()?.ordernumber;

  return total_count;
};

export const updateCount = async () => {
  let newCount = await getCount();
  try {
    const docRef = doc(db, "orders", "number");
    setDoc(
      docRef,
      {
        ordernumber: newCount + 1,
      },
      { merge: true }
    );
  } catch (e) {
    return;
  }
};

const getCount = async () => {
  const docRef = doc(db, "orders", "number");
  const docSnap = await getDoc(docRef);
  let total_count = docSnap?.data().ordernumber;

  return total_count;
};
