import { configureStore } from "@reduxjs/toolkit";
import logger from 'redux-logger';
import shopperReducer from "./shoppersSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, shopperReducer);

export const store = configureStore({
  reducer: { shopper: persistedReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
    .concat(logger),
  devTools: process.env.NODE_ENV === 'development',
});

export let persistor = persistStore(store);
