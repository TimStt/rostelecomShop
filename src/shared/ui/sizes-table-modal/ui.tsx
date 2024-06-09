"use client";

import React, { createRef, use, useCallback, useEffect, useRef } from "react";
import Modal from "../modal";
import style from "./sizes-table-modal.module.scss";
import Icon from "../icon";
import cls from "classnames";
import { useWatch } from "@/shared/lib/modal";
import { useScrollHidden } from "@/shared/lib/modal/useScrollHidden";
import { useDispatch, useSelector } from "react-redux";
import { selectSizesTableState, toggleSizesTable } from "./store";
import { INewSizeClothes } from "@/shared/config/types/goods";
import {
  ModifierGoods,
  selectSelectedSize,
  selectSizes,
  setSelectedSize,
} from "./store/slice";
import { Button } from "../button";
import { motion } from "framer-motion";
import { Table } from "./ui/table";
import { useBasketAction } from "@/shared/utils/useBasketAction";
import { PulseLoader } from "../pulse-loader";
import { Toaster } from "react-hot-toast";
import ModalMotion from "../ModalMotion/ui";

const SizesTableModal = () => {
  const isOpenModal = useSelector(selectSizesTableState);
  const {
    currentBasketItem,
    useHandlerAddToBasket,
    addToBasketSpinner,
    productBySize,
    updateCountSpinner,
  } = useBasketAction(true);
  const selectedSize = useSelector(selectSelectedSize);
  const dispatch = useDispatch();

  const refModal = useRef<HTMLDialogElement>(null);
  const addProductToBasket = useHandlerAddToBasket(productBySize?.count || 1);
  // const addProductBasket = () => {

  // };
  console.log("productBySize count", productBySize?.count);

  const closeModal = useCallback(
    () => refModal.current?.close(),

    []
  );
  useEffect(() => {
    !!isOpenModal ? refModal.current?.showModal() : closeModal();
  }, [closeModal, isOpenModal, refModal]);

  useWatch(refModal, closeModal);
  useScrollHidden(isOpenModal);
  return (
    <ModalMotion className={style.root} ref={refModal} state={isOpenModal}>
      <header className={style.root__header}>
        <h2>Таблица размеров</h2>

        <button
          className={cls("btn-reset", style.root__close)}
          onClick={() => dispatch(toggleSizesTable(false))}
        >
          <Icon name="common/close" />
          <span className="visually-hidden">
            Закрыть окно быстрого просмотра
          </span>
        </button>
        <span className="visually-hidden">Закрыть</span>
      </header>

      <Table productBasket={currentBasketItem} />
      <Button
        className={style.root__addToBasket}
        onClick={addProductToBasket}
        variant="primary"
        size="medium"
        disabled={
          selectedSize.length === 0 || addToBasketSpinner || updateCountSpinner
        }
      >
        {addToBasketSpinner || updateCountSpinner ? (
          <PulseLoader size={12} color="#fff" />
        ) : (
          "В корзину"
        )}
      </Button>
    </ModalMotion>
  );
};

export default SizesTableModal;
