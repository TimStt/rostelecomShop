"use client";
import Icon from "@/shared/ui/icon";
import React, { useRef } from "react";
import cls from "classnames";
import { useDispatch, useSelector } from "react-redux";

import style from "./product-card-page.module.scss";
import { TypeProduct } from "@/shared/ui/card/ui/type-product";
import { Spinner } from "@/shared/ui/spinner";
import Image from "next/image";
import { ArticleAndInstock } from "@/shared/ui/card/ui/article-and-in";
import {
  selectSelectedSize,
  toggleSizesTable,
} from "@/shared/ui/sizes-table-modal/store";
import { SizesListCheckBox } from "@/shared/ui/sizes-list-checkbox";
import { useBasketAction } from "@/shared/utils/useBasketAction";
import AddBtnAndCounter from "@/shared/ui/quick-view-modal/ui/add-btn-and-counter/ui";
import { selectCurrentProductState } from "@/shared/stores/current-product-add-busket";
import { Accardions } from "./ui/accardions";
import { toggleStatePopupShare } from "./ui/popup-/store";
import { BreadCrumb } from "@/shared/ui/breadcrumbs";
import { useFavoriteAction } from "@/shared/utils/use-favorite-action";
import useCompareAction from "@/shared/utils/use-compare-action/use-compare-action";

const ProductCardPage = () => {
  const dispatch = useDispatch();
  const product = useSelector(selectCurrentProductState);
  const hasType = product?.isBestseller || product?.isNew;
  const selectedSize = useSelector(selectSelectedSize);
  const { currentBasketItem } = useBasketAction();
  const { handlerCardAddToFavorites, hasProductNotSize } =
    useFavoriteAction(product);

  return (
    <section className={cls(style.root, "container")}>
      <BreadCrumb
        className={style.root__breadcrumbs}
        nameProduct={product?.name}
      />
      {!!product ? (
        <article className={style.root__wrapper}>
          <div
            className={cls(style.root__gallery, {
              [style.isOneImg]: product.images.length === 1,
            })}
          >
            {product.images.map((image, index) => (
              <Image
                src={image}
                alt={product.name}
                key={index}
                width={480}
                height={480}
              />
            ))}
          </div>

          <div className={style["root__text-content"]}>
            {hasType && (
              <TypeProduct product={product} classname={style.root__type} />
            )}
            <h1 className={style.root__title}>{product.name}</h1>
            <div className={style.root__block}>
              <span className={style.root__block__price}>
                {product.price} ₽
              </span>
              <div className={style.root__panel}>
                <button
                  className={cls(style.root__panel__button, "btn-reset", {
                    [style.hasInFavorites]: hasProductNotSize,
                  })}
                  title="Добавить в избранное"
                  onClick={handlerCardAddToFavorites}
                  disabled={hasProductNotSize}
                >
                  <Icon
                    name={`goods/${hasProductNotSize ? "heart2" : "heart"}`}
                  />
                  <span className="visually-hidden">Добавить в избранное</span>
                </button>
                <button
                  className={cls(style.root__panel__button, "btn-reset")}
                  title="Поделиться ссылкой на товар"
                  onClick={() => dispatch(toggleStatePopupShare(true))}
                >
                  <Icon name="common/share" />
                  <span className="visually-hidden">
                    Поделиться ссылкой на товар
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
              Цвет:
              <span> {product.characteristics?.color ?? "неизвестно"}</span>
            </span>

            {product.sizes?.length && (
              <>
                <span className={cls(style.root__text, style.root__size)}>
                  Размер:
                  <span> {selectedSize}</span>
                </span>
                <SizesListCheckBox
                  classname={style.root__sizesList}
                  sizesData={product.sizes}
                  product={currentBasketItem}
                />
                <button
                  className={cls(style.root__linkToTable, "btn-reset")}
                  onClick={() => dispatch(toggleSizesTable(true))}
                >
                  {" "}
                  Таблица размеров
                </button>
              </>
            )}
            <span className={cls(style.root__text, style.root__quantity)}>
              Количество:
            </span>

            <AddBtnAndCounter
              classnname={style.root__addBtnAndCounter}
              product={product}
            />
            <Accardions
              discription={product.description}
              characteristics={product.characteristics}
            />
            {}
          </div>
        </article>
      ) : (
        <Spinner size={30} />
      )}
    </section>
  );
};

export default ProductCardPage;
