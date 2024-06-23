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
import {
  ICompareAdd,
  ICompareData,
  IFavoritesGoods,
  IGoods,
} from "@/shared/config/types/goods";
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
import { selectIsAuth } from "@/shared/stores/auth";
import { selectUser } from "@/shared/stores/user";
import { addProductsCompareThunk } from "@/shared/stores/compare";
import { addProductByLS } from "../add-product-by-LS";

const useCompareAction = (currentProductCard: IGoods | null = null) => {
  let productCurrent = useSelector(selectCurrentProductState);
  productCurrent = currentProductCard || productCurrent;

  const { user } = useSelector(selectUser);

  const isAuth = useSelector(selectIsAuth);

  const dispatch = useDispatch<AppDispatch>();

  const currentProductsByCampare = (
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("compare") as string)
      : []
  ) as ICompareData[];
  const hasProductCompare =
    productCurrent !== null && !!currentProductsByCampare
      ? currentProductsByCampare.some(
          (item) => item?._id === productCurrent?._id
        )
      : false;
  const [addToCompareSpinner, setAddToCompareSpinner] = useState(false);

  const addInCompare = () => {
    const clientId = Math.random().toString(36).substring(2, 15);

    if (!productCurrent) return;
    const newCompareItemAuth = {
      clientId: clientId,
      userId: user?._id as string,
      productId: currentProductCard?._id as string,

      setSpinner: setAddToCompareSpinner,

      sizes: productCurrent?.sizes,
      category: productCurrent?.category,
    };

    if (!isAuth) {
      const newCompareItem: ICompareData = {
        _id: productCurrent?._id as string,
        clientId: clientId,
        userId: user?._id as string,
        productId: productCurrent?._id as string,
        image: productCurrent?.images[0],
        sizes: productCurrent?.sizes,
        name: productCurrent?.name,
        characteristics: productCurrent?.characteristics,
        price: productCurrent?.price,
        category: productCurrent?.category,
        inStock: productCurrent?.inStock,
      };
      addProductByLS(newCompareItem, "compare");
      return;
    }

    dispatch(addProductsCompareThunk(newCompareItemAuth as ICompareAdd));
  };
  return {
    hasProductCompare,
    addToCompareSpinner,
    addInCompare,
  };
};

export default useCompareAction;
