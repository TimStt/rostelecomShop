"use client";
import React, { use, useId } from "react";
import style from "./pay-view.module.scss";
import { Button } from "@/shared/ui";
import Icon from "@/shared/ui/icon";
import cls from "classnames";
import Link from "next/link";
import CountUp from "react-countup";
import useBasketAction from "@/shared/utils/useBasketAction/useBasketAction";
import { useItemAction } from "@/shared/utils/useItemAction";
import { IPayViewProps } from "@/shared/config/types/ui";

const PayView = ({
  countPoducts,
  nameDelivery,
  typePay,
  weight,
  isOrder,
}: IPayViewProps) => {
  const [isAgreementChecked, setIsAgreementChecked] = React.useState(false);
  const { sumPrice, isOldSumPrice } = useItemAction();

  const idAgreement = useId();
  return (
    <div className={style.root}>
      <div className={style.root__top}>
        <span className={style.root__top__title}>
          <span className={style.root__top__text}>
            {countPoducts > 4
              ? "товаров"
              : countPoducts === 1
              ? "товар"
              : "товара"}{" "}
            товара на сумму:
          </span>
          <CountUp
            className={style.root__top__value}
            start={isOldSumPrice}
            end={sumPrice}
            suffix=" ₽"
          />{" "}
        </span>
        <span className={style.root__top__title}>
          <span className={style.root__top__text}>Сумма со скидками:</span>

          <CountUp
            className={style.root__top__value}
            start={isOldSumPrice}
            end={sumPrice}
            suffix=" ₽"
          />
        </span>
        {isOrder && (
          <>
            <span className={style.root__top__title}>
              <span className={style.root__top__text}>Общий вес:</span>
              <span className={style.root__top__value}>{weight}</span>
            </span>
            <span className={style.root__top__title}>
              <span className={style.root__top__text}>Доставка:</span>
              <span className={style.root__top__value}> {nameDelivery}</span>
            </span>
            <span className={style.root__top__title}>
              <span className={style.root__top__text}>Оплата::</span>
              <span className={style.root__top__value}> {typePay}</span>
            </span>
          </>
        )}
      </div>

      <div className={style.root__bottom}>
        <h2 className={style.root__bottom__title}>Итого:</h2>
        <CountUp
          className={style.root__bottom__price}
          start={isOldSumPrice}
          end={sumPrice}
          suffix=" ₽"
        />{" "}
        <br />
        <Button
          className={cls(style.root__bottom__button, {
            [style.isDisabled]: !isAgreementChecked,
          })}
          type="submit"
          size="large"
          disabled={!isAgreementChecked}
          href={isOrder ? "/basket/order" : "/basket/order"}
          as={Link}
        >
          Оформить заказ
        </Button>
        <label
          className={cls(style.root__agreement, {
            [style.isChecked]: isAgreementChecked,
          })}
          htmlFor={idAgreement}
        >
          <input
            className={cls(style.root__agreement__checkBox, "input-reset")}
            type="checkbox"
            id={idAgreement}
            checked={isAgreementChecked}
            onChange={() => setIsAgreementChecked(!isAgreementChecked)}
          />

          <p>
            Нажимая на кнопку «Оформить заказ», вы даете согласие на обработку
            <span className={style.root__agreement__highlightedWord}>
              {" "}
              персональных данных
            </span>
          </p>
        </label>
      </div>
    </div>
  );
};

export default PayView;
