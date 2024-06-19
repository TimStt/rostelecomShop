"use client";
import { IBasketGoods } from "@/shared/config/types/goods";
import style from "./list-order-products.module.scss";
import { TitleBlock } from "../title-block";
import { CardProductList } from "@/shared/ui/card-product-list";
import { Spinner } from "@/shared/ui/spinner";

const ListOrderProducts = ({ goods }: { goods: IBasketGoods[] }) => {
  return (
    <div className={style.root}>
      <TitleBlock number={1} title="Заказ" />
      <div className={style.root__inner}>
        <div className={style.root__keys}>
          <span>№</span>
          <span>Изображение</span>
          <span>Наименование</span>
          <span>Размер</span>
          <span>Цвет</span>
          <span>Количество</span>
          <span>Сумма</span>
        </div>
        <ol className={style.root__list}>
          {!!goods.length ? (
            goods.map((item: IBasketGoods) => (
              <li key={`card-${item._id + item.size}`}>
                <CardProductList
                  classname={style.root__card}
                  product={item}
                  isOrder={true}
                />
              </li>
            ))
          ) : (
            <Spinner className={style.root__spinner} size={50} />
          )}
        </ol>
      </div>
    </div>
  );
};

export default ListOrderProducts;
