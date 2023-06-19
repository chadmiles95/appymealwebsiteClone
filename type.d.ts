export interface Product {
  item: string;
  id: string;
  price: number;
  modifiers: any[];
  quantity: number;
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
  hours: any;
  lat: number;
  lng: number;
  accountType: string;
  menus: any;
  webFee: number;
  appFee: number;
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
  taxRate: number;
  enableFans: boolean;
  enableDelivery: boolean;
  enablePrinting: boolean;
  deliveryType: object;
  expectedWaitTime: number;
  menuSelected?: string;
  menuHours?: string;
  menuStatus?: any;
}
[];

const Restaurants: Restaurant[] = [];

export interface Item {
  item: string;
  id: string;
  price: number;
  modifiers: any[];
  quantity: number;
}
[];

export interface StoreProduct {
  item: string;
  id: string;
  description?: string;
  price: number;
  modifiers: any[];
  quantity: number;
}

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
}

export interface OptionType {
  name: string;
  price: number | string;
}

export interface MenuItemType {
  allergies: Array<any>;
  desc: string;
  firstOptionMultiple: boolean;
  firstOptionName: string;
  firstOptionRequired: boolean;
  firstOptions: Array<OptionType>;
  ingredient: Array<any>;
  isAvailable: boolean;
  isShowing: boolean;
  name: string;
  price: number;
  secondOptionMultiple: boolean;
  secondOptionName: string;
  secondOptionRequired: boolean;
  secondOptions: Array<OptionType>;
  selectTempRequired: boolean;
  showRawWarning: boolean;
  showTemp: boolean;
  sides: Array<OptionType>;
  sidesRequired: boolean;
}

export interface MenuItemProps {
  item: MenuItemType;
}
