"use client";
import {
  IBasketGoods,
  ICompareGoods,
  IFavoritesGoods,
  IGoods,
} from "@/shared/config/types/goods";
import { useUserAuth } from "@/shared/lib/auth/utils/isUserAuth";

import { create } from "domain";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addProductsThunk } from "@/shared/stores/basketAuth/slice";
import { selectUser } from "@/shared/stores/user";
import { useGetStateOnLocalStorage } from "../useGetStateOnLocalStorage";
import { use, useCallback } from "react";
import {
  addGoodstoFavorites,
  addProductsFavoritesThunk,
  setIsEmptyFavorites,
} from "@/shared/stores/favorites";
import { addGoodsNoteAuth } from "@/shared/stores/basket";
import { set } from "mongoose";

interface IAddProductBasketAuth {
  product: IGoods;
  count: number;
  storeName?: "basket" | "favorites" | "compare";

  setSpinner: (state: boolean) => void;
  selectedSizes?: string;
}

interface IBasketAddProduct {
  product: IGoods;
  selectedSizes: string;
  storeName?: "basket" | "favorites" | "compare";
  count: number;
  isToast?: boolean;
}

export const useAddProductBasket = ({
  product,
  selectedSizes,
  count,
  isToast = true,
  storeName = "basket",
}: IBasketAddProduct) => {
  const dispatch = useDispatch<AppDispatch>();

  let store =
    typeof localStorage !== "undefined"
      ? (JSON.parse(localStorage?.getItem(storeName) as string) as unknown as
          | IBasketGoods[]
          | IFavoritesGoods[])
      : [];

  if (!store) {
    store = [];
  }
  const isAuth = useUserAuth();
  const isHasProduct = store.find(
    (productItem) =>
      productItem?.productId === product?._id &&
      productItem.size === selectedSizes
  );

  let clientId = Math.random().toString(36).substring(2, 15);

  return () => {
    if (isHasProduct) {
      const countUpdated =
        isHasProduct.count !== count ? count : isHasProduct.count + 1;

      const newBasket = store.map((basketProduct) =>
        isHasProduct === basketProduct
          ? {
              ...basketProduct,
              count: countUpdated,
            }
          : basketProduct
      );

      store = newBasket;
      clientId = isHasProduct.clientId;
    } else {
      store = [
        ...store,
        {
          name: product.name,
          price: product.price,
          count,
          size: selectedSizes,
          clientId: clientId,
          quantityStock: product.isCount || 0,
          productId: product?._id as string,
          image: product?.images[0],
          totalPrice: product.price,
          inStock: false,
          color: product.characteristics?.color ?? "",
          category: product.category,
        },
      ];
    }
    localStorage.setItem(storeName, JSON.stringify(store));

    if (isToast) {
      toast.success(
        `${product.name} добавлен в ${
          storeName === "basket"
            ? "корзину"
            : storeName === "compare"
            ? "сравнение"
            : "избранное"
        }`
      );
    }

    switch (storeName) {
      case "basket":
        !isAuth && dispatch(addGoodsNoteAuth(store));
        break;
      case "compare":
        // dispatch(addGoodsNoteAuth(store));
        break;
      case "favorites":
        !isAuth && dispatch(addGoodstoFavorites(store));
        dispatch(setIsEmptyFavorites(false));
        break;
    }

    return clientId;
  };
};

export const useAddProductBasketAuth = ({
  product,
  count,
  setSpinner,
  selectedSizes = "",
  storeName = "basket",
}: IAddProductBasketAuth) => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuth = useUserAuth();
  const { user } = useSelector(selectUser);
  const handlerByNoteAuth = useAddProductBasket({
    product,
    selectedSizes,
    count,
    isToast: true,
    storeName,
  });

  const handlerByAuth = useAddProductBasket({
    product,
    selectedSizes,
    count,
    isToast: false,
    storeName,
  });

  return useCallback(() => {
    if (!isAuth) {
      handlerByNoteAuth();
      return;
    }

    const accessToken = JSON.parse(localStorage.getItem("tokens") as string)
      .accessToken as string;

    const clientId = handlerByAuth();
    const addProductInfo = {
      jwt: accessToken,
      setSpinner,
      productId: product?._id,
      count: count,
      sizes: selectedSizes,
      clientId: clientId,
      userId: user?._id as string,
      category: product.category,
    };
    switch (storeName) {
      case "basket":
        dispatch(addProductsThunk(addProductInfo));
        break;
      case "compare":
        // dispatch(addProductsFavoritesThunk(addProductInfo));
        break;
      case "favorites":
        dispatch(addProductsFavoritesThunk(addProductInfo));
        break;
    }
  }, [
    isAuth,
    handlerByAuth,
    setSpinner,
    product?._id,
    product?.category,
    count,
    selectedSizes,
    user?._id,
    storeName,
    handlerByNoteAuth,
    dispatch,
  ]);
};
