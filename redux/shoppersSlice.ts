import { createSlice } from "@reduxjs/toolkit";
import { StoreProduct, UserInfo, Restaurants } from "../type";

interface ShopperState {
  productData: StoreProduct[];
  restaurants: Restaurants[];
  userInfo: null | UserInfo;
  currentTime: Date;
  militaryTime: string;
}

const initialState: ShopperState = {
  productData: [],
  restaurants: [],
  userInfo: null,
  currentTime: new Date(),
  militaryTime: "0000",
};

export const shopperslice = createSlice({
  name: "shopper",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.productData.find(
        (item: StoreProduct) => item._id === action.payload._id
      );

      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.productData.push(action.payload);
      }
    },
    plusQuantity: (state, action) => {
      const item = state.productData.find(
        (item: StoreProduct) => item._id === action.payload._id
      );
      if (item) {
        item.quantity++;
      }
    },
    minusQuantity: (state, action) => {
      const item = state.productData.find(
        (item: StoreProduct) => item._id === action.payload._id
      );
      if (item?.quantity === 1) {
        item.quantity = 1;
      } else {
        item!.quantity--;
      }
    },
    deleteItem: (state, action) => {
      state.productData = state.productData.filter(
        (item) => item._id !== action.payload
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
} = shopperslice.actions;
export default shopperslice.reducer;
