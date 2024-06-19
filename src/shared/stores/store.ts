"use client";

import { foundSlice } from "@/entities/found-modal";
import { menuSlice } from "@/entities/menu/store/slice";
import { globalAuthSlice } from "@/shared/stores/auth-modal";
import { authSlice } from "@/shared/stores/auth";
import { sizesTableModalSlice } from "@/shared/ui/sizes-table-modal/store/slice";

import {
  Action,
  ThunkAction,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";

import { goodsCatalogSlice } from "@/widgets/catalog-main/store/slice";
import { userSlice } from "@/shared/stores/user";

import { goodsHitsAndNewSlice } from "@/widgets/new-and-hits-goods/store/slice";
import { basketSlice } from "@/shared/stores/basket";
import { basketAuthSlice } from "@/shared/stores/basketAuth";

import { BlockList } from "net";
import { createWrapper } from "next-redux-wrapper";

import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { navigationSlice } from "@/widgets/header/ui/navigation/store/slice";
import { quickViewModalSlice } from "@/shared/ui/quick-view-modal/store/slice";
import { compareAuthSlice } from "@/shared/stores/compare-autth";
import { favoritesAuthSlice } from "@/shared/stores/favorites-auth";
import { favoritesSlice } from "@/shared/stores/favorites";
import { compareSlice } from "@/shared/stores/compare";
import { menuModalSlice } from "@/shared/stores/menu-catalog-modal";
import { m } from "framer-motion";
import { currentProductAddBusketSlice } from "./current-product-add-busket";
import { popupShareSlice } from "@/widgets/product-card-page/ui/popup-/store";
import { orderSlice } from "./order";

// ...

const parsistConfig = {
  key: "root",
  storage,
  whitelist: ["menu", "found", "filter", "auth", "globalAuth"],
  blocklist: ["goodsCatalog", "goodsHitsAndNew"],
};

const reducer = combineReducers({
  menu: menuSlice.reducer,
  found: foundSlice.reducer,
  goodsHitsAndNew: goodsHitsAndNewSlice.reducer,
  goodsCatalog: goodsCatalogSlice.reducer,
  auth: authSlice.reducer,

  globalAuth: globalAuthSlice.reducer,
  user: userSlice.reducer,
  navigation_popups: navigationSlice.reducer,
  basket: basketSlice.reducer,
  basketAuth: basketAuthSlice.reducer,
  quickViewModal: quickViewModalSlice.reducer,
  sizesTableModal: sizesTableModalSlice.reducer,
  compareAuth: compareAuthSlice.reducer,
  favoritesAuth: favoritesAuthSlice.reducer,
  favorites: favoritesSlice.reducer,
  compare: compareSlice.reducer,
  menuModal: menuModalSlice.reducer,
  currentProductAddBusket: currentProductAddBusketSlice.reducer,
  popupShare: popupShareSlice.reducer,
  order: orderSlice.reducer,
});

// const parsisReducer = persistReducer(parsistConfig, reducer);

// const customReducer = (state: any, action: PayloadAction<any>) => {
//   switch (action.type) {
//     case HYDRATE:
//       return {
//         ...state,
//         goodsHitsAndNew: {
//           isGoods: action.payload.goodsHitsAndNew.isGoods,
//         },
//       };

//     default:
//       return parsisReducer(state, action);
//   }
// };
export const makeStore = () => {
  const store = configureStore({
    reducer: reducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  return store;
};

export type Store = ReturnType<typeof makeStore>;

export type AppDispatch = Store["dispatch"];
export type RootState = ReturnType<Store["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export const wrapper = createWrapper(makeStore, { debug: true });
