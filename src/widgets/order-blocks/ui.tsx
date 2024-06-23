import React, { useEffect, useRef } from "react";

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
import {
  selectIsStatesDeliveryTub,
  selectIsStatesTabPayment,
  selectScrollToRequeredBlock,
} from "@/shared/stores/order/slice";
import toast from "react-hot-toast";

const OrderBlocks = () => {
  const { goods } = useBasketByAuth();
  const statesTabPay = useSelector(selectIsStatesTabPayment);
  const stateTabDelivery = useSelector(selectIsStatesDeliveryTub);
  const shouldScrollToDelivery = useRef(true);
  const [isFisrtRender, setIsFisrtRender] = React.useState(true);
  const stateScrollToRequeredBlock = useSelector(selectScrollToRequeredBlock);

  const refBlockDelivery = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isFisrtRender) {
      shouldScrollToDelivery.current = false;
      setIsFisrtRender(false);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFisrtRender) {
      return;
    }

    shouldScrollToDelivery.current = true;

    window.scrollTo({
      top:
        (refBlockDelivery.current?.getBoundingClientRect().top as number) +
        window.scrollY +
        -50,
      behavior: "smooth",
    });

    toast.error("Нужно указать адрес доставки");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateScrollToRequeredBlock]);

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
            <DeliveryOrder ref={refBlockDelivery} />
            <Payments />
            <UserOrderInfo />
          </div>
          <PayView
            countPoducts={goods.length}
            isOrder={true}
            typePay={statesTabPay.cash ? "Наличные" : "Онлайн"}
            nameDelivery={
              stateTabDelivery.selfDelivery
                ? "Самовывоз (беслпатно)"
                : "Доставка курьером"
            }
          />
        </div>
      </section>
      <MapModal />
    </>
  );
};

export default OrderBlocks;
