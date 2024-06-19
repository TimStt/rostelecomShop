import React, { MutableRefObject, useCallback, useEffect, useRef } from "react";
import Modal from "../modal";
import { IQuickViewModalProps } from "./types";
import style from "./quick-view-modal.module.scss";
import cls from "classnames";
import { SliderQuickModal } from "./ui/slider-quick-modal";
import { useWatch } from "@/shared/lib/modal";
import { useScrollHidden } from "@/shared/lib/modal/useScrollHidden";
import { useDispatch, useSelector } from "react-redux";
import {
  selectModalQuickState,
  selectProductQuick,
  toggleModalQuik,
} from "./store";
import Image from "next/image";
import Icon from "../icon";
import {
  IBasketGoods,
  ICharacteristicsTShirts,
  ICharacteristicsWithComposition,
  IClothes,
  IGoods,
} from "@/shared/config/types/goods";
import { selectCurrentProductAddBusketState } from "@/shared/stores/current-product-add-busket";
import { useBasketAction } from "@/shared/utils/useBasketAction";
import ModalMotion from "../ModalMotion/ui";

import { SizesListCheckBox } from "../sizes-list-checkbox";
import {
  selectSelectedSize,
  setSelectedSize,
  toggleSizesTable,
} from "../sizes-table-modal/store";
import { Button } from "../button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Counter } from "../counter";
import { PulseLoader } from "../pulse-loader";
import { Toaster } from "react-hot-toast";
import { ArticleAndInstock } from "../card/ui/article-and-in";
import AddBtnAndCounter from "./ui/add-btn-and-counter/ui";

const QuickViewModal = () => {
  const product = useSelector(selectCurrentProductAddBusketState);
  const isOpenModal = useSelector(selectModalQuickState);
  const { currentBasketItem } = useBasketAction();
  const refWrapper = useRef() as MutableRefObject<HTMLDivElement>;
  const dispatch = useDispatch();

  const openSizesTable = () => {
    dispatch(toggleModalQuik(false));
    dispatch(toggleSizesTable(true));
  };

  const refModal = useRef<HTMLDialogElement>(null);

  const pathname = usePathname();
  const closeModal = useCallback(() => {
    dispatch(toggleModalQuik(false));
    setTimeout(() => refModal.current?.close(), 1000);
  }, [dispatch]);

  useEffect(() => {
    !!isOpenModal
      ? refModal.current?.showModal()
      : dispatch(setSelectedSize(""));
  }, [closeModal, dispatch, isOpenModal, refModal]);

  useWatch(refWrapper, closeModal, isOpenModal);
  useScrollHidden(isOpenModal);

  if (product)
    return (
      <ModalMotion className={style.root} ref={refModal} state={isOpenModal}>
        <div className={style.root__wrapper} ref={refWrapper}>
          {product?.images.length > 1 ? (
            <SliderQuickModal
              images={product.images}
              productName={product.name}
            />
          ) : (
            <Image
              className={style.root__image}
              src={product.images[0]}
              alt={product.name}
              width={258}
              height={302}
            />
          )}
          <div className={style.root__content}>
            <header className={style.root__header}>
              <h2 className={style.root__title}>{product.name}</h2>
              <button
                className={cls("btn-reset", style.root__close)}
                onClick={closeModal}
              >
                <Icon name="common/close" />
                <span className="visually-hidden">
                  Закрыть окно быстрого просмотра
                </span>
              </button>
            </header>

            <section className={style.root__body}>
              <div className={style.root__block}>
                <span className={style.root__block__price}>
                  {product.price} ₽
                </span>
                <div className={style.root__panel}>
                  <button
                    className={cls(style.root__panel__button, "btn-reset")}
                    title="Добавить в избранное"
                  >
                    <Icon name="goods/heart" />
                    <span className="visually-hidden">
                      Добавить в избранное
                    </span>
                  </button>
                  <button
                    className={cls(style.root__panel__button, "btn-reset")}
                    title="Добавить в сравнение"
                  >
                    <Icon name="goods/compare" />
                    <span className="visually-hidden">
                      Добавить в сравнение
                    </span>
                  </button>
                </div>
              </div>
              <ArticleAndInstock
                classname={style.root__stock}
                inStock={product.inStock}
                article={product.article}
              />

              <span className={cls(style.root__text, style.root__color)}>
                Цвет: {product.characteristics?.color ?? "неизвестно"}
              </span>

              <span className={cls(style.root__text, style.root__composition)}>
                Состав:{" "}
                {(product.characteristics as ICharacteristicsWithComposition)
                  ?.composition ?? ""}
              </span>

              {!!product.sizes?.length && (
                <div className={style.root__sizes}>
                  <div className={style.root__block}>
                    <span className={style.root__text}>Размер: </span>
                    <button
                      className={cls(
                        style.root__block__linkToTable,
                        "btn-reset"
                      )}
                      onClick={openSizesTable}
                    >
                      {" "}
                      Таблица размеров
                    </button>
                  </div>
                  <SizesListCheckBox
                    classname={style.root__sizes__list}
                    product={currentBasketItem}
                    sizesData={product.sizes}
                  />{" "}
                </div>
              )}

              <span className={cls(style.root__text, style.root__quantity)}>
                Количество:
              </span>

              <AddBtnAndCounter
                classnname={style.root__addToBasketAndCounter}
                product={product}
              />

              <Link
                href={`${pathname}${product._id}`}
                className={style.root__link}
              >
                Больше информации о товаре
              </Link>
            </section>
          </div>
        </div>
      </ModalMotion>
    );
};

export default QuickViewModal;
