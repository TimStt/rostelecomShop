"use client";
import cls from "classnames";

import { Button } from "@/shared/ui/button";
import { useBasketAction } from "@/shared/utils/useBasketAction";
import { useSelector } from "react-redux";
import { selectSelectedSize } from "@/shared/ui/sizes-table-modal/store";
import { IBasketGoods, IGoods } from "@/shared/config/types/goods";
import style from "./add-btn-and-counter.module.scss";
import { PulseLoader } from "@/shared/ui/pulse-loader";
import { Counter } from "@/shared/ui/counter";
import { productNotSizes } from "@/shared/config/constants/product-not-sizes";

const AddBtnAndCounter = ({
  product,
  classnname,
}: {
  product: IGoods;
  classnname?: string;
}) => {
  const {
    useHandlerAddToBasket,
    addToBasketSpinner,
    productBySize,
    updateCountSpinner,
    setCount,
    count,
    oneCurrentCartItemCount,
  } = useBasketAction();
  const selectedSize = useSelector(selectSelectedSize);
  const totalCount = oneCurrentCartItemCount();
  const productNotesSize = productNotSizes.includes(product.type);
  const stateDisabledBiSizes =
    !product.inStock ||
    !product.sizes?.length ||
    !selectedSize.length ||
    addToBasketSpinner ||
    updateCountSpinner;

  const stateDisabledNoteSize =
    !product.inStock || addToBasketSpinner || updateCountSpinner;
  const addProductToBasket = useHandlerAddToBasket(count || 0);
  return (
    <div className={cls(style.root, classnname)}>
      <Counter
        count={count}
        className={style.root__counter}
        updateCountAsync={false}
        product={productBySize as IBasketGoods}
        setCount={setCount}
        oneCurrentCartItemCount={totalCount}
        disabled={
          !productNotesSize ? stateDisabledBiSizes : stateDisabledNoteSize
        }
      />

      <Button
        className={style.root__addToBasket}
        onClick={addProductToBasket}
        disabled={
          !productNotesSize ? stateDisabledBiSizes : stateDisabledNoteSize
        }
      >
        {addToBasketSpinner || updateCountSpinner ? (
          <PulseLoader size={12} color="#fff" />
        ) : product.inStock ? (
          "Добавить в корзину"
        ) : (
          "Нет в наличии"
        )}
      </Button>
    </div>
  );
};

export default AddBtnAndCounter;
