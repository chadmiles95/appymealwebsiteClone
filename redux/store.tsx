import { configureStore, combineReducers } from '@reduxjs/toolkit';
import logger from 'redux-logger';
// eslint-disable-next-line import/extensions, import/no-unresolved
import { CurriedGetDefaultMiddleware } from '@reduxjs/toolkit/dist/getDefaultMiddleware';
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

const rootReducer = combineReducers({
  shopper: shopperReducer,
  // TODO: We can add more reducers here do better organize sub-categories
  // Typically I see keys like restaurants, user, cart, etc.
})
const persistedReducer = persistReducer(persistConfig, rootReducer);

const getMiddleware = (getDefaultMiddleware: CurriedGetDefaultMiddleware<any>) => {
  if (process.env.NODE_ENV === 'development') {
      return getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      })
      .concat(logger);
  }

  return getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  });
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getMiddleware,
  devTools: process.env.NODE_ENV === 'development',
});

export let persistor = persistStore(store);
