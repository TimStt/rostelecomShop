"use client";
import React from "react";
import style from "./card.module.scss";
import Image from "next/image";
import { ICard } from "./types";
import cls from "classnames";
import Icon from "../icon";
import Link from "next/link";
import { Button } from "..";

import { MenusCard } from "./ui/menus-card";

import { productNotSizes } from "@/shared/config/constants/product-not-sizes";

import { PulseLoader } from "../pulse-loader";

import { useCardLogic } from "@/shared/hooks/use-card-logic/hook";
import { TypeProduct } from "./ui/type-product";
import { motion } from "framer-motion";
import { motionSettingsVisibleOpacity } from "../ModalMotion";

const Card = (product: ICard) => {
  const hasType = product.isBestseller || product.isNew;

  const { classname, ...otherProduct } = product;
  const { isHasProductInBasket, clickAddBasket, addToBasketSpinner } =
    useCardLogic(product);
  const img = product.images?.[0];

  return (
    <motion.article
      className={cls(style.root, classname)}
      {...motionSettingsVisibleOpacity}
    >
      <Link
        href={`/catalog/${product.category}/${product._id}`.replaceAll(
          "//",
          "/"
        )}
        className={style.root__link}
        replace
      >
        <Image
          className={style.root__image}
          src={img}
          alt={product.name}
          width={352}
          height={352}
          loading="lazy"
        />
      </Link>
      <div className={style.root__content}>
        <label className={style.root__title}>{product.name}</label>
        <div className={style.root__block}>
          <div
            className={cls(style.root__block__isStock, {
              [style.isNotAvailable]: !product.inStock,
            })}
          >
            <Icon name="goods/circle" />
            <span>{product.inStock ? "Есть в наличии" : "Нет в наличии"}</span>
          </div>
          <span className={style.root__block__article}>
            Арт.: {product.article}
          </span>
        </div>
        <div className={cls(style.root__block, style.root__block__bottom)}>
          <span className={style.root__price}>{product.price} ₽</span>

          {productNotSizes.includes(product.type) ? (
            <Button
              className={cls(style.root__block__button, {
                [style.isHasProductInBasket]: isHasProductInBasket,
              })}
              variant="primary"
              size="small"
              disabled={!product.inStock || addToBasketSpinner}
              onClick={clickAddBasket}
            >
              {addToBasketSpinner ? (
                <PulseLoader size={12} color="var(--color-white)" />
              ) : isHasProductInBasket ? (
                "Добавлено"
              ) : (
                "Добавить"
              )}
            </Button>
          ) : (
            <Button
              className={style.root__block__button}
              variant="primary"
              size="small"
              disabled={!product.inStock}
              onClick={clickAddBasket}
            >
              В корзину
            </Button>
          )}
        </div>
      </div>

      <MenusCard classname={style.root__menus} product={otherProduct} />
      {hasType && <TypeProduct product={product} />}
    </motion.article>
  );
};

export default React.memo(Card);
