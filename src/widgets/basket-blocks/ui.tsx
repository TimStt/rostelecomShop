import React from "react";
import HeaderBasket from "./ui/header-basket/ui";
import { CardProductList } from "../../shared/ui/card-product-list";
import PromoInput from "./ui/promo-input/ui";
import PayView from "./ui/pay-view/ui";
import style from "./basket-bloks.module.scss";
import cls from "classnames";
import { useBasketByAuth } from "@/shared/lib/auth/utils/useBasketByAuth";
import { IBasketGoods } from "@/shared/config/types/goods";
import EmptyPageContent from "@/shared/ui/empty-page-content/ui";
import Head from "next/head";

const BasketBlocks = () => {
  const { goods } = useBasketByAuth();

  return (
    <>
      {" "}
      <Head>
        <title>Корзина ({goods?.length || 0}) | Rostelecom Shop</title>
        <meta name="description" content="Корзина" />
      </Head>
      {!!goods.length ? (
        <section className={cls(style.root, "container")}>
          <HeaderBasket />

          <div className={style.root__inner}>
            <div className={style.root__goods}>
              <ul className={style.root__goods__list}>
                {goods.map((item: IBasketGoods) => (
                  <li key={`card-${item._id + item.size}`}>
                    <CardProductList
                      classname={style.root__card}
                      product={item}
                    />
                  </li>
                ))}
              </ul>
              <PromoInput />
            </div>
            <div className={style.root__block}>
              <PayView countPoducts={goods.length} />
            </div>
          </div>
        </section>
      ) : (
        <EmptyPageContent
          title={"Ой...<br/> Кажется здесь ещё пусто..."}
          subtitle={"Ваша корзина пуста"}
          buttonText={"Перейти к покупкам"}
          srcImage="/empty-page/basket-cart.png"
          backgroundText={"Пусто"}
          discription="Чтобы совершить покупку перейдите в каталоги положите в корзину выбранные вещи"
        />
      )}
    </>
  );
};

export default BasketBlocks;
