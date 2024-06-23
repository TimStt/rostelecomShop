import { selectCurrentProductState } from "@/shared/stores/current-product-add-busket";
import { useSelector } from "react-redux";

export const useCurrentProduct = () => {
  const currentProduct = useSelector(selectCurrentProductState);

  return currentProduct;
};
