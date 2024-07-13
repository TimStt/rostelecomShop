import { useGetStateOnLocalStorage } from "@/shared/hooks/use-get-state-LS";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addViewProduct } from "@/shared/stores/store";
import { IGoods } from "@/shared/config/types/goods";
import { selectViewProducts } from "@/shared/stores/store";
import { Card } from "@/shared/ui/card";
import style from "./view-goods.module.scss";
import { setViewProduct } from "@/shared/stores/store/slice";
import cls from "classnames";

const ViewGoods = () => {
  const dispatch = useDispatch();
  const setProduct = useCallback(
    (product: IGoods[]) => dispatch(setViewProduct(product)),
    [dispatch]
  );
  const { goods: viewGoods } = useSelector(selectViewProducts);

  useGetStateOnLocalStorage("viewGoods", setProduct);
  return (
    viewGoods && (
      <section className={cls(style.root, "container")}>
        <h2 className={style.root__title}>Просмотренные товары</h2>
        <ul className={style.root__list}>
          {viewGoods.map((product) => (
            <li key={product._id}>
              <Card {...product} />
            </li>
          ))}
        </ul>
      </section>
    )
  );
};

export default ViewGoods;
