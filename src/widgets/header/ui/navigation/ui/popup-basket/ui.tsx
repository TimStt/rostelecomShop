"use client";
import style from "./popup-basket.module.scss";
import cls from "classnames";
import { useDispatch, useSelector } from "react-redux";
import Icon from "@/shared/ui/icon";
import Popup from "@/shared/ui/popup";
import Link from "next/link";
import { Button } from "@/shared/ui";
import { selectStatesPopups, togglePopups } from "../../store";
import { paths } from "@/shared/routing";
import CountUp from "react-countup";
import { useItemAction } from "@/shared/hooks/use-item-action";
import CardProduct from "./ui/card-product/ui";

const PopupBasket = ({ classname }: { classname: string }) => {
  const dispatch = useDispatch();
  const { basket: isOpen } = useSelector(selectStatesPopups);
  const { currentProductsBasket, isOldSumPrice, sumPrice, totalPriceSum } =
    useItemAction();

  const closePopup = () =>
    dispatch(
      togglePopups({
        basket: false,
      })
    );

  return (
    <>
      <Link
        className={cls(classname, style.root__link, {
          [style.isBasketNoteEmpty]: !!currentProductsBasket.length,
        })}
        href={paths.basket}
        onMouseEnter={() =>
          dispatch(togglePopups({ profile: false, basket: true }))
        }
      >
        <Icon name="goods/basket" />
        <span className="visually-hidden">Открыть страницу корзины</span>
      </Link>
      <Popup
        className={cls(style.root, {
          [style.isOpen]: isOpen,
        })}
        onMouseLeave={closePopup}
        aria-labelledby="popup-basket-title"
      >
        <div className={cls(style.root__wrapper)}>
          <header className={style.header}>
            <h2 className={style.header__title} id="popup-basket-title">
              Корзина
            </h2>
            <button
              className={cls("btn-reset", style.header__close)}
              onClick={closePopup}
            >
              <Icon name="common/close" />
              <span className="visually-hidden">Закрыть окно</span>
            </button>
          </header>
          <ul
            className={cls(style.list, {
              [style.isEmpty]: !currentProductsBasket.length,
            })}
          >
            {currentProductsBasket.length ? (
              currentProductsBasket.map((product) => {
                const id = product.clientId;

                return (
                  <li key={id} className={style.list__item}>
                    <CardProduct product={product} />
                  </li>
                );
              })
            ) : (
              <li className={style.root__empty}>
                <Icon name="common/empty-cart" />
                <span>Корзина пуста 😢</span>
              </li>
            )}
          </ul>
          {currentProductsBasket.length && (
            <div className={style.result}>
              <span className={style.result__summary}>
                <span className={style.result__summary__text}>
                  {" "}
                  Сумма заказа:{" "}
                </span>
                <CountUp
                  className={style.result__summary__price}
                  start={isOldSumPrice}
                  end={sumPrice}
                  suffix=" ₽"
                />
              </span>
              <Button
                className={style.result__button}
                variant="primary"
                size="small"
              >
                {" "}
                Оформить заказ
              </Button>
            </div>
          )}
        </div>
      </Popup>
    </>
  );
};
export default PopupBasket;
