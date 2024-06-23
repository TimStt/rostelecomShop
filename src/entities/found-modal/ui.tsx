import Link from "next/link";
import Image from "next/image";
import React, { use, useCallback, useEffect, useRef, useState } from "react";
import style from "./found-modal.module.scss";
import cls from "classnames";

import Icon from "@/shared/ui/icon";

import Modal from "@/shared/ui/modal";
import { useDispatch, useSelector } from "react-redux";
import {
  getFoundedProductsThunk,
  selectModalFound,
  setFoundedProducts,
  setLoadingFound,
  setSearchValue,
  toggleModalFound,
} from "./store/slice";

import { Input } from "@/shared/ui/input";
import { useWatch, useOpen } from "@/shared/lib/modal";
import { useScrollHidden } from "@/shared/lib/modal/useScrollHidden";
import { IGoods } from "@/shared/config/types/goods";
import debounce from "@/shared/utils/debounce/debounce";
import { PulseLoader } from "@/shared/ui/pulse-loader";
import { CardProductFound } from "./ui/card-product-found";
import { Hints } from "./ui/hints";
import { ModalMotion } from "@/shared/ui/ModalMotion";

export const FoundModal = () => {
  const modalRef = React.useRef<HTMLDialogElement>(null);
  const modalInnerRef = React.createRef<HTMLDivElement>();
  const inputRef = React.createRef<HTMLInputElement>();
  const { isOpenModal, searchValue, foundedProducts, loading, type, category } =
    useSelector(selectModalFound);

  const dispatch = useDispatch<AppDispatch>();

  const closeModal = useCallback(() => {
    dispatch(toggleModalFound(false));
    setTimeout(() => modalRef.current?.close(), 500);
  }, [dispatch, modalRef]);

  useEffect(() => {
    !!isOpenModal ? modalRef.current?.showModal() : closeModal();
  }, [closeModal, dispatch, isOpenModal, modalRef]);
  useWatch(modalInnerRef, closeModal, isOpenModal);
  const clearSearch = () => {
    dispatch(setSearchValue(""));
    inputRef.current?.focus();
    dispatch(setFoundedProducts([]));
  };

  const foundProducts = debounce((value: string) => {
    dispatch(
      getFoundedProductsThunk({ value, type: type, category: category })
    );
  }, 3500);

  const changeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setSearchValue(value));
    if (!value.length && !type.length && !category.length) return;
    dispatch(setLoadingFound(true));

    foundProducts(e.target.value);
  };

  useScrollHidden(isOpenModal);

  return (
    <ModalMotion className={style.root} ref={modalRef} state={isOpenModal}>
      <div className={cls("container", style.root__inner)} ref={modalInnerRef}>
        <header className={style.root__header}>
          <h2>Поиск товаров</h2>
          <button
            className={cls("btn-reset", style.root__close)}
            onClick={closeModal}
          >
            <Icon name="common/close" />
            <span className="visually-hidden">Закрыть меню</span>
          </button>
        </header>
        <Input
          className={style.root__search}
          variant="input-found"
          placeholder="Название товара, категории, тип..."
          value={searchValue}
          ref={inputRef}
          onClear={clearSearch}
          onChange={changeSearch}
        />
        <div className={style.root__hint}></div>

        <Hints />
        <div className={style.root__products}>
          {!loading ? (
            !!foundedProducts.length ? (
              <ul className={style.root__products__list}>
                {foundedProducts?.map((item) => (
                  <li
                    className={style.root__products__list__item}
                    key={item._id}
                  >
                    <CardProductFound
                      type={item.type}
                      name={item.name}
                      image={item.images[0]}
                      category={item.category}
                      _id={item._id}
                      price={item.price}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className={style.root__empty}>
                <Icon name="common/empty-cart" />
                <span>Пока что таких товаров нет 😔</span>
              </div>
            )
          ) : (
            <PulseLoader
              size={16}
              color="#fff"
              className={style.root__loader}
            />
          )}
        </div>
      </div>
    </ModalMotion>
  );
};
