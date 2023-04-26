// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import type { NextApiRequest, NextApiResponse } from "next";
// import { db } from "../_app";
// import { collection, onSnapshot, getDocs } from "firebase/firestore";

// type Data = {
//   id: string;
//   name: string;
//   username: string;
//   city: string;
//   zip: string;
//   state: string;
//   desc: string;
//   email: string;
//   phoneNumber: string;
//   address: string;
//   hours: object;
//   lat: number;
//   lng: number;
//   accountType: string;
//   menus: object;
//   isOpen: boolean;
//   isShowing: boolean;
//   createdAt: string;
//   photo: string;
//   location: object;
//   viewport: object;
//   fanDiscount: number;
//   fanCount: number;
//   images: any[];
//   fans: any[];
//   enableFans: boolean;
//   enableDelivery: boolean;
//   enablePrinting: boolean;
//   deliveryType: object;
//   expectedWaitTime: number;
// }[];

// const restaurantData: Data = [];

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data[]>
// ) {
//   //   res.status(200).json(restaurantData);
//   try {
//     const restaurantRef = collection(db, "restaurants");

//     // Use getDocs if you want a one-time fetch
//     // const restaurantSnapshot = await getDocs(restaurantRef);
//     // const restaurantData: Data = restaurantSnapshot.docs.map((doc) => {
//     //   return { ...doc.data(), id: doc.id } as Data;
//     // });

//     // res.status(200).json(restaurantData);

//     // Use onSnapshot if you want to listen for real-time updates
//     onSnapshot(restaurantRef, (snapshot) => {
//       const restaurantData: Data = snapshot.docs.map((doc) => {
//         return { ...doc.data(), id: doc.id } as Data;
//       });

//       res.status(200).json(restaurantData);
//     });
//   } catch (error) {
//     res.status(500).json({ error: "An error occurred while fetching data" });
//   }
// }
