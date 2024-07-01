"use client";

import { productNotSizes } from "@/shared/config/constants/product-not-sizes";
import { IFavoritesGoods, IGoods } from "@/shared/config/types/goods";
import { count } from "console";
import { useAddProductBasketAuth } from "../addProductBasket";
import { useDispatch } from "react-redux";
import { toggleSizesTable } from "@/shared/ui/sizes-table-modal/store";
import { tr } from "@faker-js/faker";
import { useHandleShowSIzeTable } from "../handleShowSIzeTable";
import { useCallback } from "react";
import { IStoreName } from "@/shared/config/types/goods";

export const useAddProductBySizeTable = (
  product: IGoods,
  setSpinner: (state: boolean) => void,
  count: number,
  selectedSize: string = "",
  storeName?: IStoreName
) => {
  const showSizesTable = useHandleShowSIzeTable({ storeName });
  const addProductNoteSizesByAuth = useAddProductBasketAuth({
    product,
    count,
    setSpinner,
    storeName,
  });

  const addProductBasketSizesAuth = useAddProductBasketAuth({
    product,
    count,
    setSpinner,
    selectedSizes: selectedSize,
    storeName,
  });

  return useCallback(() => {
    if (productNotSizes.includes(product?.type)) {
      addProductNoteSizesByAuth();
      return;
    }
    if (selectedSize) {
      addProductBasketSizesAuth();

      return;
    }
    showSizesTable();
  }, [
    product?.type,
    selectedSize,
    showSizesTable,
    addProductNoteSizesByAuth,
    addProductBasketSizesAuth,
  ]);
};
