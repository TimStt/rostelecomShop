import { productNotSizes } from "@/shared/config/constants/product-not-sizes";
import { IGoods, IStoreName } from "@/shared/config/types/goods";
import { selectCurrentProductState } from "@/shared/stores/current-product-add-busket";
import { makeStore } from "@/shared/stores/store";
import {
  setProduct,
  setStoreName,
  toggleSizesTable,
} from "@/shared/ui/sizes-table-modal/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useHandleShowSIzeTable = ({
  storeName = "basket",
}: {
  storeName?: IStoreName;
}) => {
  const dispatch = useDispatch();
  const currentProduct = useSelector(selectCurrentProductState);

  useEffect(() => {
    if (!currentProduct || productNotSizes.includes(currentProduct.type))
      return;
    dispatch(setProduct(currentProduct as IGoods));
  }, [currentProduct, dispatch]);

  return () => {
    dispatch(setStoreName(storeName));
    dispatch(toggleSizesTable(true));
  };
};
