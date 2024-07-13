import React, { useEffect } from "react";
import style from "./header.module.scss";
import cls from "classnames";

import Icon from "@/shared/ui/icon";

import { Logo } from "@/shared/ui/logo";
import Menu from "@/entities/menu";
import { useDispatch, useSelector } from "react-redux";

import Navigation from "./ui/navigation/ui";
import AuthModal from "../auth-modal/ui";
import { toggleModalMenu } from "@/shared/stores/menu-catalog-modal";
import { useGetStateOnLocalStorage } from "@/shared/hooks/use-get-state-LS";
import {
  IBasketGoods,
  ICompareData,
  IFavoritesGoods,
  IGoods,
} from "@/shared/config/types/goods";
import { addGoodsNoteAuth } from "@/shared/stores/basket";
import { useUserAuth } from "@/shared/lib/auth/utils/isUserAuth";
import { replaceProductsThunk } from "@/shared/stores/basketAuth";
import App from "next/app";
import { selectIsAuth } from "@/shared/stores/auth";
import {
  checkEmptyFavoritesThunk,
  replaceProductsFavoritesThunk,
} from "@/shared/stores/favorites";
import { replaceProductsCompareThunk } from "@/shared/stores/compare";
import { useTriggerLoginCheck } from "@/shared/lib/auth/utils/useTriggerLoginCheck/useTriggerLoginCheck";

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const openModal = () => dispatch(toggleModalMenu(true));

  const isAuth = useSelector(selectIsAuth);

  useGetStateOnLocalStorage("basket", (products: IBasketGoods[]) =>
    dispatch(addGoodsNoteAuth(products), isAuth)
  );

  const checkStateLs = (state: any[]) => !!state && Array.isArray(state);
  useTriggerLoginCheck();
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("tokens") as string);
    if (isAuth && token) {
      const basket = JSON.parse(localStorage.getItem("basket") as string);
      const favorites = JSON.parse(
        localStorage.getItem("favorites") as string
      ) as IFavoritesGoods[];
      const compare = JSON.parse(
        localStorage.getItem("compare") as string
      ) as ICompareData[];

      checkStateLs(basket) &&
        dispatch(replaceProductsThunk({ productsReplace: basket }));
      checkStateLs(favorites)
        ? dispatch(
            replaceProductsFavoritesThunk({
              productsReplace: favorites,
            })
          )
        : dispatch(checkEmptyFavoritesThunk());
      checkStateLs(compare) &&
        dispatch(replaceProductsCompareThunk({ productsReplace: compare }));
    }
  }, [dispatch, isAuth]);

  return (
    <header className={cls(style.root, "container")}>
      <div className={style.inner}>
        <button
          className={cls("btn-reset", style["menu-button"])}
          onClick={openModal}
        >
          <span className={style["icon-block"]}>
            <Icon name="common/menu" />
          </span>
          <span>Меню</span>
        </button>
        <Menu />

        <Logo className={style.inner__logo} />
        <Navigation />
      </div>
    </header>
  );
};

export default Header;
