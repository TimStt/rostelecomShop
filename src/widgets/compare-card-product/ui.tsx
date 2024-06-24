import {
  ICompareData,
  IFavoritesGoods,
  IGoods,
} from "@/shared/config/types/goods";
import React from "react";
import Image from "next/image";
import styles from "./compare-card-product.module.scss";
import { useAddProductBySizeTable } from "@/shared/utils/useAddProductBySizeTable/useAddProductBySizeTable";
import Icon from "@/shared/ui/icon";
import { PulseLoader } from "@/shared/ui/pulse-loader";
import cls from "classnames";
import Link from "next/link";
import { addProductsThunk } from "@/shared/stores/basketAuth/slice";
import { useDispatch, useSelector } from "react-redux";
import { set } from "mongoose";
import { useCardLogic } from "@/shared/utils/useCardLogic/useCardLogic";
import { productInList } from "@/shared/utils/productInList";
import { useBasketAction } from "@/shared/utils/useBasketAction";
import { addProductByLS } from "@/shared/utils/add-product-by-LS/add-product-by-LS";
import {
  addGoodstoFavorites,
  removeProductsFavoritesThunk,
  setIsEmptyFavorites,
} from "@/shared/stores/favorites";
import { deleteProductByLS } from "@/shared/utils/deleteProductByLS/deleteProductByLS";
import { selectIsAuth } from "@/shared/stores/auth";
import { Accardions } from "../product-card-page/ui/accardions";
import {
  deleteOneProductCompareThunk,
  setIsEmptyCompare,
} from "@/shared/stores/compare";

const CompereCard = ({ product }: { product: ICompareData }) => {
  const [isLoadingAddToBasket, setLoadingAddToBasket] = React.useState(false);
  const [isLoadingRemove, setLoadingRemove] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { currentProductsBasket } = useBasketAction();
  const userAuth = useSelector(selectIsAuth);

  const handleRemove = () => {
    if (!userAuth) {
      const newProducts = deleteProductByLS(product.clientId, "compare");
      dispatch(addGoodstoFavorites(newProducts));
      !newProducts.length && dispatch(setIsEmptyCompare(true));
      return;
    }
    dispatch(
      deleteOneProductCompareThunk({
        id: product.clientId as string,
        setSpinner: setLoadingRemove,
      })
    );
  };
  // const hasProductInBasket = currentProductsBasket.find(
  //   (item) =>
  //     item?.productId === product?.productId && product.size === item.size
  // );

  // const handleAddToCart = () => {
  //   const accessToken =
  //     (JSON.parse(localStorage.getItem("tokens") as string)
  //       ?.accessToken as string) ?? "";
  //   if (!accessToken) {
  //     addProductByLS;
  //   }

  //   const { _id, ...otherProduct } = product;

  //   addProductByLS(otherProduct, "basket");

  //   if (!accessToken) {
  //     toast.success(`Товар ${product.name} добавлен в корзину`);
  //     return;
  //   }

  //   const addProductInfoAuth = {
  //     jwt: accessToken,
  //     setSpinner: setLoadingAddToBasket,
  //     productId: product?.productId as string,
  //     count: product.count,
  //     sizes: product.size,
  //     clientId: product.clientId,
  //     userId: product.userId as string,
  //     category: product.category,
  //   };

  //   dispatch(addProductsThunk(addProductInfoAuth));
  // };
  return (
    <article key={product._id} className={styles.root}>
      <Link
        className={styles.root__image}
        href={`catalog/${product.category}/${product.productId}`}
      >
        <Image
          src={product.image}
          alt={product.name}
          className={styles.productImage}
          width={160}
          height={160}
        />
      </Link>
      <div className={styles.productInfo}>
        <h2 className={styles.root__info__name}>{product.name}</h2>
        <span className={styles.root__info__price}>
          Цена: {product.price} ₽
        </span>
        <br />
        <span>Размеры: {product.sizes ? "Есть" : "Отсутствуют"}</span>

        <Accardions
          classname={styles.root__accardions}
          characteristics={product.characteristics}
        />

        <div className={styles.root__info__buttonGroup}>
          <button
            // onClick={handleAddToCart}
            className={cls(styles.root__addToCartButton, "btn-reset")}
            title="Добавить в корзину"
            // disabled={isLoadingAddToBasket || !!hasProductInBasket}
          >
            {!isLoadingAddToBasket ? (
              <>
                <Icon name="goods/basket" />
                <span className="visually-hidden">
                  Добавить {product.name} в корзину
                </span>
              </>
            ) : (
              <PulseLoader size={6} color="#fff" gap={2} />
            )}
          </button>
          <button
            className={cls(styles.root__removeButton, "btn-reset")}
            onClick={handleRemove}
            title="Удалить из избранного"
            disabled={isLoadingRemove}
          >
            {!isLoadingRemove ? (
              <>
                <Icon name="goods/delete" />
                <span className="visually-hidden">
                  Удалить {product.name} из избранного
                </span>
              </>
            ) : (
              <PulseLoader size={6} color="#fff" gap={2} />
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default CompereCard;
