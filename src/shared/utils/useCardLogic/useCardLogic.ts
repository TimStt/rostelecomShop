"use client";
import { useDispatch } from "react-redux";
import { useBasketAction } from "../useBasketAction";
import { useMemo, useState } from "react";
import { productInList } from "../productInList";
import product from "next-seo/lib/jsonld/product";
import { setCurrentProduct } from "@/shared/stores/current-product-add-busket";
import { useAddProductBySizeTable } from "../useAddProductBySizeTable/useAddProductBySizeTable";
import { IGoods } from "@/shared/config/types/goods";

export const useCardLogic = (product: IGoods) => {
  const dispatch = useDispatch();
  const { currentProductsBasket, setAddToBasketSpinner, addToBasketSpinner } =
    useBasketAction();

  const isHasProductInBasket =
    product && productInList(currentProductsBasket, product._id);

  const addProductBasketBySizeTable = useAddProductBySizeTable(
    product,
    setAddToBasketSpinner,
    1
  );

  const clickAddBasket = () => {
    dispatch(setCurrentProduct(product));
    addProductBasketBySizeTable();
  };

  const addFavorites = () => {
    dispatch(setCurrentProduct(product));
  };

  return {
    isHasProductInBasket,
    clickAddBasket,
    addToBasketSpinner,
  };
};
