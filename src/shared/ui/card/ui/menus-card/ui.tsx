import React, { useState } from "react";

import Link from "next/link";
import Popup from "@/shared/ui/popup";
import cls from "classnames";
import style from "./menus-card.module.scss";
import { motion } from "framer-motion";
import { IGoods } from "@/shared/config/types/goods";
import { QuickViewModal, toggleModalQuik } from "@/shared/ui/quick-view-modal";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentProductState,
  setCurrentProduct,
} from "@/shared/stores/current-product-add-busket";
import { useFavoriteAction } from "@/shared/utils/use-favorite-action";
import Icon from "@/shared/ui/icon";
import { addProductsCompareThunk } from "@/shared/stores/compare";
import useCompareAction from "@/shared/utils/use-compare-action/use-compare-action";

const MenusCard = ({
  classname,
  product,
}: {
  classname: string;
  product: IGoods;
}) => {
  const dispatch = useDispatch();

  const openQuickViewModal = () => {
    dispatch(setCurrentProduct(product));
    dispatch(toggleModalQuik(true));
  };

  const { handlerCardAddToFavorites, hasProductNotSize } =
    useFavoriteAction(product);

  const addToFaavorites = () => {
    dispatch(setCurrentProduct(product));
    handlerCardAddToFavorites();
  };
  const { addInCompare, hasProductCompare } = useCompareAction(product);

  return (
    <div className={cls(style.root, classname)}>
      <div className={style.root__item}>
        <button
          className={cls(style.root__link, "btn-reset", {
            [style.hasInFavorites]: hasProductNotSize,
          })}
          onClick={addToFaavorites}
          disabled={hasProductNotSize}
        >
          <Icon name={`goods/${hasProductNotSize ? "heart2" : "heart"}`} />
          <span className="visually-hidden">Добавить в избранное</span>
        </button>
        <Popup className={style.root__popup} role="tooltip">
          <div className={style.root__popup__wrapper}>
            <span> Добавить в избранное</span>
          </div>
        </Popup>
      </div>
      <div className={style.root__item}>
        <button
          className={cls(style.root__link, "btn-reset")}
          onClick={addInCompare}
          disabled={hasProductCompare}
        >
          <Icon name="goods/compare" />
          <span className="visually-hidden">Добавить в сравнение</span>
        </button>
        <Popup className={style.root__popup} role="tooltip">
          <div className={style.root__popup__wrapper}>
            <span> Добавить в сравнение</span>
          </div>
        </Popup>
      </div>
      <div className={style.root__item}>
        <button
          className={cls(style.root__link, "btn-reset")}
          onClick={openQuickViewModal}
        >
          <Icon name="goods/eys" />
          <span className="visually-hidden">Быстрый просмотр</span>
        </button>
        <Popup className={style.root__popup} role="tooltip">
          <div className={style.root__popup__wrapper}>
            <span> Быстрый просмотр</span>
          </div>
        </Popup>
      </div>
    </div>
  );
};

export default MenusCard;
