import { IBasketGoods } from "@/shared/config/types/goods";
import { useItemAction } from "@/shared/hooks/use-item-action";
import Link from "next/link";
import React, { useId } from "react";
import style from "./card-product.module.scss";
import cls from "classnames";
import Image from "next/image";
import Icon from "@/shared/ui/icon";
import CountUp from "react-countup";
import { PulseLoader } from "@/shared/ui/pulse-loader";
import { usePathname } from "next/navigation";
import { Counter } from "@/shared/ui/counter";
import useGetOldValue from "@/shared/utils/useGetOldValue/useGetOldValue";

const CardProduct = ({ product }: { product: IBasketGoods }) => {
  const { _id, name, totalPrice, image, size, count, productId } = product;
  const {
    isDeleteSpinner,

    setCount,
    deleteProduct,

    totalPriceSum,
  } = useItemAction();
  const deleteProductById = () => deleteProduct(productId);

  const pathname = usePathname();

  const valueTotalPrice = totalPriceSum(product._id as string);

  const oldPriceTotalItem = useGetOldValue(
    totalPriceSum(product._id as string)
  );
  return (
    <>
      <Link href={`${pathname}${productId}`} className={style.image}>
        <Image src={image} alt={name} width={100} height={100} />
      </Link>
      <div className={style.block}>
        <h3 className={style.title}>
          {name}
          {!!size && `, ${size.toUpperCase()}`}
        </h3>
        <button
          className={cls(style.icon, style.delete, "btn-reset")}
          onClick={deleteProductById}
        >
          {isDeleteSpinner ? (
            <PulseLoader size={2} color="#ffffff" gap={1.5} />
          ) : (
            <Icon name="goods/delete" />
          )}
          <span className="visually-hidden">
            {isDeleteSpinner
              ? "Удаление товара..."
              : `Удалить товар ${name} из корзины`}
          </span>
        </button>
      </div>
      <div className={style.block}>
        <Counter
          className={style.quantity}
          count={count}
          product={product}
          setCount={setCount}
          updateCountAsync={true}
        />
        <CountUp
          className={style.price}
          end={valueTotalPrice}
          suffix=" ₽"
          start={oldPriceTotalItem}
        />
      </div>
    </>
  );
};

export default CardProduct;
