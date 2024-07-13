"use client";
import { useBasketByAuth } from "@/shared/lib/auth/utils/useBasketByAuth";
import { selectSelectedSize } from "@/shared/ui/sizes-table-modal/store";
import { use, useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productInList } from "../../utils/productInList";
import { useUserAuth } from "@/shared/lib/auth/utils/isUserAuth";
import {
  useAddProductBasket,
  useAddProductBasketAuth,
} from "../../utils/add-product-basket/util";
import { selectCurrentProductState } from "@/shared/stores/current-product-add-busket";
import { IGoods } from "@/shared/config/types/goods";
import { set } from "mongoose";
import { useAddProductBySizeTable } from "../use-add-product-by-size-table/util";
import {
  deleteProductsThunk,
  updateCountBasketThunk,
} from "@/shared/stores/basketAuth/slice";

const useBasketAction = (isSizeTable = false) => {
  const productModal = useSelector(selectCurrentProductState);
  const selectedSizes = useSelector(selectSelectedSize);
  const { goods: currentProductsBasket } = useBasketByAuth();

  const currentBasketItem =
    productModal !== null && currentProductsBasket.length > 0
      ? currentProductsBasket.filter(
          (item) => item?.productId === productModal?._id
        )
      : [];

  const tokens =
    typeof window === "undefined"
      ? ""
      : JSON.parse(localStorage.getItem("tokens") as string);

  const productBySize =
    currentBasketItem &&
    currentBasketItem.find((item) => item.size === selectedSizes);

  const isHasProductInBasket =
    productModal !== null &&
    currentProductsBasket.length > 0 &&
    productInList(
      currentProductsBasket as unknown as IGoods[],
      productModal?._id as string
    );
  const [count, setCount] = useState(productBySize?.count || 0);
  const [addToBasketSpinner, setAddToBasketSpinner] = useState(false);
  const [updateCountSpinner, setUpdateCountSpinner] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const isUserAuth = useUserAuth();

  const allCurrentCartItemCount = useMemo(
    () => currentProductsBasket.reduce((a, { count }) => a + count, 0),
    [currentProductsBasket]
  );
  const oneCurrentCartItemCount = () =>
    currentBasketItem.reduce((a, { count }) => a + count, 0);

  const useHandlerAddToBasket = (countProps?: number) => {
    const handlerNoteAuth = useAddProductBasket({
      product: productModal as IGoods,
      selectedSizes: selectedSizes,
      count: countProps || 1,
    });
    const handlerAuth = useAddProductBasketAuth({
      product: productModal as IGoods,
      selectedSizes: selectedSizes,
      count: countProps || 1,
      setSpinner: setAddToBasketSpinner,
    });
    const addProductToBasket = useAddProductBySizeTable(
      productModal as IGoods,
      setAddToBasketSpinner,
      countProps || 1,
      selectedSizes
    );

    return useCallback(() => {
      if (!!productModal) {
        if (!!productBySize) {
          if (!isUserAuth) {
            handlerNoteAuth();
            return;
          }

          const updateCount = !!countProps
            ? productBySize.count !== countProps
              ? countProps
              : productBySize.count + 1
            : productBySize.count + 1;

          dispatch(
            updateCountBasketThunk({
              id: productBySize?._id ?? "",
              count: updateCount,
              jwt: tokens.accessToken,
              setSpinner: setUpdateCountSpinner,
            })
          );
          handlerNoteAuth();

          return;
        }

        if (isSizeTable) {
          handlerAuth();
          return;
        }
      }
      addProductToBasket();
    }, [addProductToBasket, handlerNoteAuth, countProps, handlerAuth]);
  };

  return {
    selectedSizes,
    currentProductsBasket,
    addToBasketSpinner,
    setAddToBasketSpinner,
    productBySize,
    useHandlerAddToBasket,
    isHasProductInBasket,
    currentBasketItem,
    updateCountSpinner,

    allCurrentCartItemCount,
    setCount,
    count,
    oneCurrentCartItemCount,
  };
};

export default useBasketAction;
