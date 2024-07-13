import { useBasketByAuth } from "@/shared/lib/auth/utils/useBasketByAuth";
import { deleteProductsThunk } from "@/shared/stores/basketAuth";
import { use, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useGetOldValue from "../../utils/useGetOldValue/useGetOldValue";
import { selectIsAuth } from "@/shared/stores/auth";
import { addGoodsNoteAuth, removeGoodsNoteAuth } from "@/shared/stores/basket";
import { deleteProductByLS } from "../../utils/delete-product-by-LS/util";
import toast from "react-hot-toast";

const useItemAction = () => {
  const [isDeleteSpinner, setIsDeleteSpinner] = useState(false);

  const tokens =
    typeof window === "undefined"
      ? {}
      : JSON.parse(localStorage.getItem("tokens") as string);

  const { goods: currentProductsBasket } = useBasketByAuth();
  const [count, setCount] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const isAuth = useSelector(selectIsAuth);

  const totalPriceSum = (id: string) =>
    !!currentProductsBasket.length
      ? currentProductsBasket.reduce(
          (acc, item) =>
            item?._id === id ? acc + item.totalPrice * item.count : acc,
          0
        )
      : 0;
  const summurizePrice = () =>
    !!totalPriceSum
      ? currentProductsBasket.reduce(
          (acc, item) => acc + totalPriceSum(item._id as string),
          0
        )
      : 0;
  const sumPrice = summurizePrice();

  const isOldSumPrice = useGetOldValue(sumPrice);

  const deleteProduct = (id: string) => {
    try {
      !isAuth
        ? dispatch(removeGoodsNoteAuth(id))
        : dispatch(
            deleteProductsThunk({
              id,

              setSpinner: setIsDeleteSpinner,
            })
          );
    } catch (error) {
      console.log(error);
    }
  };

  return {
    isDeleteSpinner,
    setIsDeleteSpinner,
    deleteProduct,
    count,
    setCount,
    summurizePrice,
    currentProductsBasket,
    isOldSumPrice,
    totalPriceSum,

    sumPrice,
  };
};
export default useItemAction;
