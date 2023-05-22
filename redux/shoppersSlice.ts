import { createSlice } from "@reduxjs/toolkit";
import { StoreProduct, UserInfo, Restaurants } from "../type";

interface ShopperState {
  productData: StoreProduct[];
  restaurants: (typeof Restaurants)[];
  userInfo: null | UserInfo;
  currentTime: Date;
  currentRestaurant: any;
  militaryTime: string;
  lastVisitedPage: string;
}

const initialState: ShopperState = {
  productData: [],
  restaurants: [],
  userInfo: null,
  currentTime: new Date(),
  currentRestaurant: {},
  militaryTime: "0000",
  lastVisitedPage: "",
};

export const shopperslice = createSlice({
  name: "shopper",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.productData.find(
        (item: StoreProduct) => item.id === action.payload.id
      );

      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.productData.push(action.payload);
      }
    },
    plusQuantity: (state, action) => {
      const item = state.productData.find(
        (item: StoreProduct) => item.id === action.payload.id
      );
      if (item) {
        item.quantity++;
      }
    },
    minusQuantity: (state, action) => {
      const item = state.productData.find(
        (item: StoreProduct) => item.id === action.payload.id
      );
      if (item?.quantity === 1) {
        item.quantity = 1;
      } else {
        item!.quantity--;
      }
    },
    updateItem: (state, action) => {
      const itemIndex = state.productData.findIndex(
        (item: StoreProduct) => item.id === action.payload._id
      );
      state.productData[itemIndex] = {
        ...state.productData[itemIndex],
        ...action.payload,
      };
    },
    deleteItem: (state, action) => {
      state.productData = state.productData.filter(
        (item) => item.id !== action.payload
      );
    },
    resetCart: (state) => {
      state.productData = [];
    },
    addUser: (state, action) => {
      state.userInfo = action.payload;
    },
    removeUser: (state) => {
      state.userInfo = null;
    },
    updateCurrentTime: (state, action) => {
      state.currentTime = action.payload.currentTime;
      state.militaryTime = action.payload.militaryTime;
    },
    setRestaurants: (state, action) => {
      state.restaurants = action.payload;
    },
    addRestaurant: (state, action) => {
      state.restaurants.push(action.payload);
    },
    setLastVisitedPage: (state, action) => {
      state.lastVisitedPage = action.payload;
    },
    checkCurrentRestaurant: (state, action) => {
      if (state.currentRestaurant?.name !== action.payload.rest.name) {
        state.currentRestaurant = action.payload.rest;
        state.productData = [];
      } else {
        null;
      }
    },
  },
});

export const {
  addToCart,
  deleteItem,
  plusQuantity,
  minusQuantity,
  resetCart,
  addUser,
  removeUser,
  updateCurrentTime,
  setRestaurants,
  addRestaurant,
  setLastVisitedPage,
  checkCurrentRestaurant,
} = shopperslice.actions;
export default shopperslice.reducer;
