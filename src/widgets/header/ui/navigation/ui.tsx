import Link from "next/link";

import style from "./nav.module.scss";
import cls from "classnames";

import FoundModal, { toggleModalFound } from "@/entities/found-modal";
import { useDispatch, useSelector } from "react-redux";
import Icon from "@/shared/ui/icon";

import PopupBasket from "./ui/popup-basket/ui";
import { paths } from "@/shared/routing";

import PopupProfile from "./ui/popup-profile/ui";
import { useCurrentProduct } from "@/shared/utils/useCurrentProduct/useCurrentProduct";
import { useBasketByAuth } from "@/shared/lib/auth/utils/useBasketByAuth";
import {
  selectFavorites,
  selectIsEmptyFavorites,
  selectLoadingCheckEmpty,
  selectLoadingFavorites,
  setIsEmptyFavorites,
} from "@/shared/stores/favorites";
import { use, useEffect, useState } from "react";
import { IFavoritesGoods, IGoods } from "@/shared/config/types/goods";
import {
  selectIsEmptyCompare,
  setIsEmptyCompare,
} from "@/shared/stores/compare";
import { PulseLoader } from "@/shared/ui/pulse-loader";
import { selectIsAuth } from "@/shared/stores/auth";

const Navigation = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const openModalFound = () => dispatch(toggleModalFound(true));

  const isEmptyFavorites = useSelector(selectIsEmptyFavorites);
  const loadingFavorites = useSelector(selectLoadingCheckEmpty);
  const favoriteProducts = useSelector(selectFavorites);
  const favorites = JSON.parse(
    localStorage.getItem("favorites") as string
  ) as IFavoritesGoods[];
  const compare = JSON.parse(
    localStorage.getItem("compare") as string
  ) as IGoods[];

  const isEmptyCompere = useSelector(selectIsEmptyCompare);

  useEffect(() => {
    if (!isAuth && !!favorites?.length) {
      dispatch(setIsEmptyFavorites(false));
    }
    if (!!compare?.length) {
      dispatch(setIsEmptyCompare(false));
    }
  }, [isEmptyFavorites, favorites, dispatch, compare, isEmptyCompere, isAuth]);

  return (
    <nav>
      <ul className={style.root}>
        <li className={cls(style.root__item, style.search)}>
          <button
            className={cls("btn-reset", style["icon-block"])}
            onClick={openModalFound}
          >
            <Icon name="goods/found" />
            <span className="visually-hidden">Открыть окно с поиском</span>
          </button>
        </li>

        <li className={style.root__item}>
          {!loadingFavorites ? (
            <>
              <Link
                className={cls(style.root__link, style["icon-block"], {
                  [style.isNotEmpty]:
                    !isEmptyFavorites || !!favoriteProducts.length,
                  [style.isDisable]: loadingFavorites,
                })}
                href={paths.favorites}
              >
                <Icon name="goods/heart" />
                <span className="visually-hidden">
                  Открыть страницу избранных товаров
                </span>
              </Link>
            </>
          ) : (
            <PulseLoader size={5} gap={2} color="#fff" />
          )}
        </li>
        <li className={style.root__item}>
          <Link
            className={cls(style.root__link, style["icon-block"], {
              [style.isNotEmpty]: !isEmptyCompere,
            })}
            href={paths.compare}
          >
            <Icon name="goods/compare" />
            <span className="visually-hidden">Открыть страницу сравнения</span>
          </Link>
        </li>
        <li className={cls(style.root__item, style.basket)}>
          <PopupBasket classname={style["icon-block"]} />
        </li>
        <li className={cls(style.root__item, style.profile)}>
          {" "}
          <PopupProfile classname={style["icon-block"]} />
        </li>
      </ul>
    </nav>
  );
};
export default Navigation;
