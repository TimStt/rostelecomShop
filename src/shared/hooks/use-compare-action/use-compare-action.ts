"use client";
import { selectSelectedSize } from "@/shared/ui/sizes-table-modal/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentProductState } from "@/shared/stores/current-product-add-busket";
import { ICompareData, IGoods } from "@/shared/config/types/goods";
import { selectIsAuth } from "@/shared/stores/auth";
import { selectUser } from "@/shared/stores/user";
import {
  addProductsCompareThunk,
  setIsEmptyCompare,
} from "@/shared/stores/compare";
import { addProductByLS } from "../add-product-by-LS";

const useCompareAction = (currentProductCard: IGoods | null = null) => {
  let productCurrent = useSelector(selectCurrentProductState);
  productCurrent = currentProductCard || productCurrent;
  const selectedSizes = useSelector(selectSelectedSize);

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
  const [loadingAddToBasket, setLoadingAddToBasket] = useState(false);

  // const addBasket = async () => {
  //   const { _id, ...otherProduct } = productCurrent as ICompareData;
  //   const isHasSize = productCurrent?.sizes;

  //   if (isHasSize) {
  //     dispatch(toggleSizesTable(true));

  //     return;
  //   }

  //   addProductByLS(
  //     {
  //       ...otherProduct,
  //       sizes: !!selectedSizes ? selectedSizes : "",
  //     },
  //     "basket"
  //   );
  //   dispatch(setIsCompareAdd(false));
  //   if (!isAuth) {
  //     toast.success(`Товар ${productCurrent?.name} добавлен в корзину`);
  //     return;
  //   }

  //   const addProductInfoAuth = {
  //     setSpinner: setLoadingAddToBasket,
  //     productId: (productCurrent as ICompareData)?.productId as string,
  //     count: (productCurrent as ICompareData)?.count,
  //     sizes: !!selectedSizes ? selectedSizes : "",
  //     clientId: (productCurrent as ICompareData)?.clientId,
  //     userId: (productCurrent as ICompareData).userId as string,
  //     category: (productCurrent as ICompareData).category,
  //   };

  //   dispatch(addProductsThunk(addProductInfoAuth));
  // };

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
    dispatch(setIsEmptyCompare(false));

    if (!isAuth) {
      const newCompareItem = {
        _id: productCurrent?._id as string,
        clientId: clientId,
        userId: user?._id as string,
        productId: productCurrent?._id as string,
        image: (productCurrent as IGoods)?.images[0],
        sizes: productCurrent?.sizes,
        name: productCurrent?.name,
        characteristics: (productCurrent as IGoods)?.characteristics,
        price: productCurrent?.price,
        category: productCurrent?.category,
        inStock: productCurrent?.inStock,
      };
      addProductByLS(newCompareItem, "compare");
      return;
    }

    dispatch(addProductsCompareThunk(newCompareItemAuth));
  };
  return {
    hasProductCompare,
    addToCompareSpinner,
    addInCompare,

    loadingAddToBasket,
  };
};

export default useCompareAction;
