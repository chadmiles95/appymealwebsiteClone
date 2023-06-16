// import { useSelector, useDispatch } from "react-redux";
// import { useEffect } from "react";
// import { updateCurrentRestaurant } from "./shoppersSlice";
// import { db } from "../pages/_app";
// import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
// import { Restaurant } from "../type";

// const setTimeForUse = () => {
//   return new Promise<{ tempDay: string; tempTime: number }>(
//     (resolve, reject) => {
//       const d = new Date();
//       d.setMinutes(d.getMinutes() - d.getTimezoneOffset());

//       const weekday = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];
//       let tempDay = weekday[d.getDay()];

//       let hour = d.getUTCHours();
//       let minutes = d.getMinutes();

//       let tempTime = parseFloat(
//         `${hour.toString().padStart(2, "0")}${minutes
//           .toString()
//           .padStart(2, "0")}`
//       );
//       resolve({ tempDay, tempTime });
//     }
//   );
// };

// export const UseUpdateRestaurantByName = async (name: string) => {
//   return new Promise((resolve, reject) => {
//     const restaurantDoc = doc(db, "restaurants", name);
//     const restaurantSnapshot = getDoc(restaurantDoc);

//     if (restaurantSnapshot.exists()) {
//       const { tempDay, tempTime }: any = setTimeForUse();
//       const restaurant: Partial<Restaurant> = {
//         id: restaurantSnapshot.id,
//         ...restaurantSnapshot.data(),
//       };

//       // Add your logic to manipulate the single restaurant object here
//       const menus = restaurant.hours[tempDay]?.menus;
//       let data = { ...restaurant, menuStatus: false };

//       if (menus) {
//         const menuEntries = Object.entries(menus);
//         const menuLength = menuEntries.length;

//         menuEntries.forEach(([key, value], i) => {
//           if (
//             (parseFloat(tempTime) >
//               parseFloat((value as string).substring(0, 4)) &&
//               parseFloat(tempTime) <
//                 parseFloat((value as string).substring(5, 9))) ||
//             value === "All Day"
//           ) {
//             data = {
//               ...data,
//               hours: restaurant.hours[tempDay]?.time,
//               menus: restaurant.menus[key],
//               menuSelected: key,
//               menuStatus: true,
//               menuHours: value as any,
//             };
//           } else if (
//             i === menuLength - 1 &&
//             data.menuStatus !== true &&
//             typeof data.hours[tempDay].menus !== "undefined"
//           ) {
//             data = {
//               ...data,
//               hours: data.hours[tempDay]?.time,
//               menus: data.menus[key],
//               menuSelected: key,
//               menuStatus: true,
//               menuHours: value as any,
//             };
//             resolve(data);
//           }
//         });
//       }

//       // dispatch(updateCurrentRestaurant(data as Restaurant)); // add this line
//     }
//     // return useSelector((state: any) => state.shopper.currentRestaurant);
//   });
// };

// // const getOneRestaurant = (name: string, tempDay) => {
// //   // console.log("trigs");
// //   return new Promise((resolve, reject) => {
// //     try {
// //       onSnapshot(collection(db, "restaurants"), (snapshot) => {
// //         snapshot.docs.map((doc) => {
// //           if (doc.data().name === name) {
// //             let data = doc.data();
// //             if (typeof data.hours[tempDay]?.menus !== "undefined") {
// //               Object.values(data.hours[tempDay]?.menus).map((r) => {
// //                 if (
// //                   (parseFloat(useTime) > parseFloat(r.substring(0, 4)) &&
// //                     parseFloat(useTime) < parseFloat(r.substring(5, 9))) ||
// //                   r === "All Day" ||
// //                   Object.keys(data.hours[localDay].menus).length === 1
// //                 ) {
// //                   let key = getObjKey(data.hours[tempDay].menus, r);

// //                   data = {
// //                     ...data,
// //                     hours: data.hours?.[tempDay]?.time,
// //                     menus: data.menus[key],
// //                     menuSelected: key,
// //                     menuStatus: true,
// //                     menuHours: r,
// //                   };

// //                   resolve(data);
// //                 }
// //               });
// //             } else {
// //               return null;
// //             }
// //             return null;
// //           }
// //         });
// //       });
// //     } catch {
// //       resolve(null);
// //     }
// //   });
// // };

// // export const retrieveOneRestaurant = async (name: string) => {
// //   return new Promise((resolve, reject) => {
// //     const { tempDay, tempTime }: any =  setTimeForUse();
// //       getOneRestaurant(name, tempDay.tempDay).then((result) => {
// //         resolve(result);
// //       });
// //     });
// //   });
// // };

import { db } from "../pages/_app";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { Restaurant } from "../type";

const setTimeForUse = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());

  const weekday = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];
  let tempDay = weekday[d.getDay()];

  let hour = d.getUTCHours();
  let minutes = d.getMinutes();

  let tempTime = parseFloat(
    `${hour.toString().padStart(2, "0")}${minutes.toString().padStart(2, "0")}`
  );
  return { tempDay, tempTime };
};

export const UseUpdateRestaurantByName = async (name: string) => {
  const restaurantDoc = doc(db, "restaurants", name);
  const restaurantSnapshot = await getDoc(restaurantDoc);

  if (restaurantSnapshot.exists()) {
    const { tempDay, tempTime } = setTimeForUse();
    const restaurant: Partial<Restaurant> = {
      id: restaurantSnapshot.id,
      ...restaurantSnapshot.data(),
    };

    // Add your logic to manipulate the single restaurant object here
    const menus = restaurant.hours[tempDay]?.menus;
    let data = { ...restaurant, menuStatus: false };

    if (menus) {
      const menuEntries = Object.entries(menus);
      const menuLength = menuEntries.length;

      menuEntries.forEach(([key, value], i) => {
        if (
          (tempTime > parseFloat((value as string).substring(0, 4)) &&
            tempTime < parseFloat((value as string).substring(5, 9))) ||
          value === "All Day"
        ) {
          data = {
            ...data,
            hours: restaurant.hours[tempDay]?.time,
            menus: restaurant.menus[key],
            menuSelected: key,
            menuStatus: true,
            menuHours: value as any,
          };
        } else if (
          i === menuLength - 1 &&
          data.menuStatus !== true &&
          typeof data.hours[tempDay].menus !== "undefined"
        ) {
          data = {
            ...data,
            hours: data.hours[tempDay]?.time,
            menus: data.menus[key],
            menuSelected: key,
            menuStatus: true,
            menuHours: value as any,
          };
        }
      });
    }

    return data;
  } else {
    throw new Error("Restaurant does not exist");
  }
};
