import React from "react";

import style from "./order-blocks.module.scss";
import cls from "classnames";
import { useBasketByAuth } from "@/shared/lib/auth/utils/useBasketByAuth";
import { IBasketGoods } from "@/shared/config/types/goods";
import EmptyPageContent from "@/shared/ui/empty-page-content/ui";
import Head from "next/head";
import SkeletonCard from "../catalog-main/ui/skeleton-card/ui";
import { PayView } from "../basket-blocks/ui/pay-view";
import "@tomtom-international/web-sdk-plugin-searchbox/dist/SearchBox.css";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import { TitleBlock } from "./ui/title-block";
import { ListOrderProducts } from "./ui/list-order-products";
import { BreadCrumb } from "@/shared/ui/breadcrumbs";
import { DeliveryOrder } from "./ui/delivery-order";
import { Payments } from "./ui/payments";
import { UserOrderInfo } from "./ui/user-order-info";
import { MapModal } from "./ui/map-modal";
import { useSelector } from "react-redux";
import { selectOpenMapModal } from "@/shared/stores/order";

const OrderBlocks = () => {
  const { goods } = useBasketByAuth();

  const isOpenModalMap = useSelector(selectOpenMapModal);

  return (
    <>
      {" "}
      <Head>
        <title>Оформление заказа | Rostelecom Shop</title>
        <meta name="description" content="Оформление заказа" />
      </Head>
      <section className={cls(style.root, "container")}>
        <BreadCrumb className={style.root__breadCrumb} />
        <h1 className={style.root__title}>Оформление заказа</h1>
        <div className={style.root__content}>
          <div className={style.root__placement}>
            <ListOrderProducts goods={goods} />
            <DeliveryOrder />
            <Payments />
            <UserOrderInfo />
          </div>
          <PayView countPoducts={goods.length} isOrder={true} />
        </div>
      </section>
      <MapModal />
    </>
  );
};

export default OrderBlocks;
