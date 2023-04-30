export interface Product {
  _id: number;
  title: string;
  description: string;
  oldPrice: number;
  price: number;
  brand: string;
  image: string;
  isNew: boolean;
  category: string;
}
[];

export interface Restaurant {
  id: string;
  name: string;
  username: string;
  city: string;
  zip: string;
  state: string;
  desc: string;
  email: string;
  phoneNumber: string;
  address: string;
  hours: object;
  lat: number;
  lng: number;
  accountType: string;
  menus: object;
  isOpen: boolean;
  isShowing: boolean;
  createdAt: string;
  photo: string;
  location: object;
  viewport: object;
  fanDiscount: number;
  fanCount: number;
  images: any[];
  fans: any[];
  enableFans: boolean;
  enableDelivery: boolean;
  enablePrinting: boolean;
  deliveryType: object;
  expectedWaitTime: number;
}
[];

const Restaurants: Restaurant[] = [];

export interface Item {
  _id: number;
  title: string;
  description: string;
  oldPrice: number;
  price: number;
  brand: string;
  image: string;
  isNew: boolean;
  category: string;
}
[];

export interface StoreProduct {
  _id: number;
  title: string;
  description: string;
  oldPrice: number;
  price: number;
  brand: string;
  image: string;
  isNew: boolean;
  category: string;
  quantity: number;
}

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
}
