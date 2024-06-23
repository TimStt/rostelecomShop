import { IFavoritesGoods } from "@/shared/config/types/goods";
import {
  addGoodstoFavorites,
  deleteAllProductsFavoritesThunk,
  getProductsFavoritesThunk,
  selectFavorites,
  selectLoadingFavorites,
} from "@/shared/stores/favorites";
import { useGetStateOnLocalStorage } from "@/shared/utils/useGetStateOnLocalStorage";
import Image from "next/image";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./favorite-page.module.scss";
import { useAddProductBySizeTable } from "@/shared/utils/useAddProductBySizeTable/useAddProductBySizeTable";
import EmptyPageContent from "@/shared/ui/empty-page-content/ui";
import { FavoriteCard } from "@/widgets/favorite-card";
import { useUserAuth } from "@/shared/lib/auth/utils/isUserAuth";
import { selectIsAuth } from "@/shared/stores/auth";
import { getProductFavorites } from "@/shared/api/get-product-favorites";
import { Spinner } from "@/shared/ui/spinner";
import { BreadCrumb } from "@/shared/ui/breadcrumbs";
import cls from "classnames";
import { Button } from "@/shared/ui";

const FavoritePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userAuth = useSelector(selectIsAuth);
  const loading = useSelector(selectLoadingFavorites);

  const updateProducts = useCallback(
    (data: IFavoritesGoods[]) => {
      dispatch(addGoodstoFavorites(data));
    },
    [dispatch]
  );
  useGetStateOnLocalStorage("favorites", userAuth, updateProducts);

  useEffect(() => {
    if (!userAuth) return;

    dispatch(getProductsFavoritesThunk());
  }, [dispatch, userAuth]);

  const dataFavoritesProducts = useSelector(selectFavorites);
  return (
    <section className={cls(styles.root, "container")}>
      {!loading ? (
        <>
          {!dataFavoritesProducts?.length ? (
            <EmptyPageContent
              title={"Ой... </br> Кажется здесь ещё пусто..."}
              subtitle={"В избранном ничего нет"}
              discription="Мы уверены что в нашем каталоге </br> вы найдете то, что вам понравится!"
              buttonText={"Вернуться в каталог"}
              backgroundText={"Пусто"}
              srcImage="/empty-page/favorite-heart.png"
            />
          ) : (
            <>
              <div className={styles.root__top}>
                <BreadCrumb className={styles.root__urlNav} />
                <Button
                  size="small"
                  onClick={() => dispatch(deleteAllProductsFavoritesThunk())}
                >
                  Очистить все
                </Button>
              </div>
              <h1 className={styles.root__title}>
                Избранные товары{" "}
                <span>Товаров {dataFavoritesProducts.length}</span>
              </h1>
              <ul className={styles.root__productList}>
                {dataFavoritesProducts.map((product) => (
                  <li key={product.clientId}>
                    <FavoriteCard product={product} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      ) : (
        <Spinner size={50} />
      )}
    </section>
  );
};

export default FavoritePage;
