import { useBasketByAuth } from "@/shared/lib/auth/utils/useBasketByAuth";
import { BreadCrumb } from "@/shared/ui/breadcrumbs";
import React from "react";
import style from "./header-basket.module.scss";

const HeaderBasket = () => {
  const { goods } = useBasketByAuth();
  return (
    <div className={style.root}>
      <BreadCrumb className={style.root__breadcrumb} />
      <h1 className={style.root__title}>
        Корзина
        <span>
          {goods?.length} {goods?.length > 1 ? "товаров" : "товар"}
        </span>
      </h1>
    </div>
  );
};

export default HeaderBasket;
