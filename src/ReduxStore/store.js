import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { encryptTransform } from "redux-persist-transform-encrypt";
import LeftMenuItems from "./features/LeftMenuItemSlice.js";
import userContext from "./features/userContext.js";
import TabAccessData from "./features/TabAccessData.js";

const persistConfig = {
  key: "root",
  storage,
  transforms: [
    encryptTransform({
      secretKey: "NitishArali",
      onError: function (error) {
        // Handle the error.
      },
    }),
  ],
};

const reducers = combineReducers({
  LeftMenuItems: LeftMenuItems,
  userContext: userContext,
  TabAccessData: TabAccessData,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
