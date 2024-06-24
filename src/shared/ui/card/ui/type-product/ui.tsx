import React, { useState } from "react";

import cls from "classnames";
import style from "./type-product.module.scss";

import { IGoods } from "@/shared/config/types/goods";

const TypeProduct = ({
  product,
  classname,
}: {
  product: IGoods;
  classname?: string;
}) => {
  return (
    <span
      className={cls(style.root, classname, {
        [style[`root__new`]]: product.isNew,
        [style[`root__hit`]]: product.isBestseller,
      })}
    >
      {product.isNew ? "Новинка" : "Хит"}
    </span>
  );
};

export default TypeProduct;
