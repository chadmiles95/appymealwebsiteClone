export interface Product {
  item: string;
  id: string;
  price: number;
  modifiers: any[];
  quantity: number;
}
[];

export interface DeliveryType {
  near: {
      enable: boolean;
      price: number;
  },
  far: {
      enable: boolean;
      price: number;
  },
  type: string;
}

export interface Restaurant {
  id: string;
  name: string;
  username: string;
  city: string;
  zip: string;
  state: string;
  desc: string;
  description?: string;
  email: string;
  phoneNumber: string;
  address: string;
  address_line_1?: string;
  address_city?: string;
  address_state_province_id?: string;
  address_zipcode?: string;
  hours: any;
  lat: number;
  lng: number;
  accountType: string;
  menus: any;
  fee_web?: number;
  webFee: number;
  fee_app?: number;
  appFee: number;
  enable_open?: boolean;
  isOpen: boolean;
  enable_showing?: boolean;
  isShowing: boolean;
  createdAt: string;
  photo: string;
  location: object;
  viewport: object;
  fee_fan_discount?: number;
  fanDiscount: number;
  fanCount: number;
  images: any[];
  fans: any[];
  taxRate: number;
  fee_tax_rate?: number;
  enableFans: boolean;
  enable_fans?: boolean;
  enableDelivery: boolean;
  enable_delivery?: boolean;
  enablePrinting: boolean;
  enable_printing?: boolean;
  deliveryType: DeliveryType;
  delivery_type?: DeliveryType;
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
