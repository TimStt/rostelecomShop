"use client";

import Image from "next/image";
import React, { useId } from "react";
import style from "./card-product-list.module.scss";
import Icon from "@/shared/ui/icon";
import { useBasketByAuth } from "@/shared/lib/auth/utils/useBasketByAuth";
import { IBasketGoods } from "@/shared/config/types/goods";
import cls from "classnames";
import { Counter } from "@/shared/ui/counter";
import { useBasketAction } from "@/shared/utils/use-basket-action";
import { Spinner } from "@/shared/ui/spinner";
import { PulseLoader } from "@/shared/ui/pulse-loader";
import CountUp from "react-countup";
import { useCardLogic } from "@/shared/hooks/use-card-logic/hook";
import { useItemAction } from "@/shared/hooks/use-item-action";
import useGetOldValue from "@/shared/utils/useGetOldValue/useGetOldValue";
import { tr } from "@faker-js/faker";
import { translateToWord } from "@/shared/utils/translateToWord";
import { translateColors, translateWords } from "@/shared/routing/paths";

const CardProductList = ({
  product,
  isOrder,
  classname,
}: {
  classname?: string;
  product: IBasketGoods;
  isOrder?: boolean;
}) => {
  const {
    isDeleteSpinner,
    count,
    setCount,
    deleteProduct,

    totalPriceSum,
  } = useItemAction();

  const {
    size,
    totalPrice,
    price,
    name,
    image,
    productId,
    color,
    count: countProduct,
  } = product;
  const deleteProductById = () => deleteProduct(product?.clientId as string);
  const key = useId();

  const valueTotalPrice = totalPriceSum(product?._id as string);

  const oldPriceTotalItem = useGetOldValue(
    totalPriceSum(product._id as string)
  );

  const imgSize = isOrder ? 106 : 160;

  if (!product) return null;

  return (
    <article className={cls(style.root, classname)} id={key}>
      <Image
        className={style.root__image}
        src={image}
        alt={name}
        width={imgSize}
        height={imgSize}
      />
      <label
        className={cls(style.root__title, style["root__main-text"])}
        htmlFor={key}
      >
        {name}
      </label>

      <span className={cls(style.root__sizes, style["root__main-text"])}>
        {!!size.length ? (isOrder ? size : "Размер: " + size) : "Без размера"}
      </span>
      {isOrder && (
        <span className={cls(style.root__color, style["root__main-text"])}>
          {translateColors[color as keyof typeof translateColors]}
        </span>
      )}
      {!isOrder && (
        <div className={style.root__priceOne}>
          <span
            className={cls(
              style.root__priceOne__price,
              style["root__main-text"]
            )}
          >
            {price} ₽
          </span>{" "}
          <span className={style.root__priceOne__sub}>Цена за 1 шт.</span>
        </div>
      )}
      {!isOrder ? (
        <Counter
          count={count}
          product={product}
          setCount={setCount}
          totalCount={15}
          updateCountAsync={true}
        />
      ) : (
        <span className={cls(style.root__count, style["root__main-text"])}>
          {countProduct} шт.
        </span>
      )}
      <CountUp
        className={style.root__priceFull}
        end={valueTotalPrice}
        suffix=" ₽"
        start={isOrder ? 0 : oldPriceTotalItem}
      />
      {!isOrder && (
        <button
          className={cls(style.root__delete, "btn-reset")}
          title={`Удалить товар ${name} из корзины`}
          onClick={deleteProductById}
        >
          {isDeleteSpinner ? (
            <PulseLoader size={4} color="#ffffff" gap={3.5} />
          ) : (
            <Icon name="goods/delete" />
          )}
        </button>
      )}
    </article>
  );
};

export default CardProductList;
