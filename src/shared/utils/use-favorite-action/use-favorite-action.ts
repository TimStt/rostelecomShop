"use client";
import { useBasketByAuth } from "@/shared/lib/auth/utils/useBasketByAuth";
import { selectSelectedSize } from "@/shared/ui/sizes-table-modal/store";
import { use, useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productInList } from "../productInList";
import { useUserAuth } from "@/shared/lib/auth/utils/isUserAuth";
import {
  useAddProductBasket,
  useAddProductBasketAuth,
} from "../addProductBasket/addProductBasket";
import { selectCurrentProductState } from "@/shared/stores/current-product-add-busket";
import { IFavoritesGoods, IGoods } from "@/shared/config/types/goods";
import { set } from "mongoose";
import { useAddProductBySizeTable } from "../useAddProductBySizeTable/useAddProductBySizeTable";
import {
  deleteProductsThunk,
  updateCountBasketThunk,
} from "@/shared/stores/basketAuth/slice";
import {
  removeProductsFavoritesThunk,
  selectFavorites,
} from "@/shared/stores/favorites";
import { productNotSizes } from "@/shared/config/constants/product-not-sizes";
import { useGetStateOnLocalStorage } from "../useGetStateOnLocalStorage";

const useFavoriteAction = (currentProductCard: IGoods | null = null) => {
  let productCurrent = useSelector(selectCurrentProductState);
  productCurrent = currentProductCard || productCurrent;

  const selectedSizes = useSelector(selectSelectedSize);
  const currentProductsByFavorites = (
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("favorites") as string)
      : []
  ) as IFavoritesGoods[];
  const currentFavoruteItem =
    productCurrent !== null && !!currentProductsByFavorites
      ? currentProductsByFavorites.filter(
          (item) => item?.productId === productCurrent?._id
        )
      : [];
  const [addToFavoritesSpinner, setAddToFavoritesSpinner] = useState(false);
  const hasProductNotSize =
    productNotSizes.includes(productCurrent?.type as IGoods["type"]) &&
    !!currentFavoruteItem?.[0];

  const hasProductBySize = (sizeSelect: string) =>
    !!productCurrent?.sizes &&
    currentProductsByFavorites &&
    currentFavoruteItem.some((item) => item.size === sizeSelect);

  const handlerCardAddToFavorites = useAddProductBySizeTable(
    productCurrent as IGoods,
    setAddToFavoritesSpinner,
    1,
    selectedSizes,
    "favorites"
  );

  return {
    hasProductBySize,
    addToFavoritesSpinner,
    handlerCardAddToFavorites,
    hasProductNotSize,
  };
};

export default useFavoriteAction;
