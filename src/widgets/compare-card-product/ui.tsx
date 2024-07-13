import {
  ICompareData,
  IFavoritesGoods,
  IGoods,
} from "@/shared/config/types/goods";
import React from "react";
import Image from "next/image";
import styles from "./compare-card-product.module.scss";
import Icon from "@/shared/ui/icon";
import { PulseLoader } from "@/shared/ui/pulse-loader";
import cls from "classnames";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useBasketAction } from "@/shared/utils/use-basket-action";
import { addGoodstoFavorites } from "@/shared/stores/favorites";
import { deleteProductByLS } from "@/shared/utils/delete-product-by-LS";
import { selectIsAuth } from "@/shared/stores/auth";
import { Accardions } from "../product-card-page/ui/accardions";
import {
  deleteOneProductCompareThunk,
  setIsEmptyCompare,
} from "@/shared/stores/compare";
import { setIsCompareAdd } from "@/shared/ui/sizes-table-modal/store";
import { setCurrentProduct } from "@/shared/stores/current-product-add-busket";
import useCompareAction from "@/shared/utils/use-compare-action/use-compare-action";
import { selectIsCompareAdd } from "@/shared/ui/sizes-table-modal/store/slice";

const CompereCard = ({ product }: { product: ICompareData }) => {
  const [isLoadingRemove, setLoadingRemove] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const userAuth = useSelector(selectIsAuth);
  const { loadingAddToBasket } = useCompareAction();
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

  const { currentProductsBasket } = useBasketAction();

  const hasProductInBasket = currentProductsBasket.find(
    (item) =>
      item?.productId === product?.productId && product.size === item.size
  );

  const handleAddToCart = () => {
    dispatch(setIsCompareAdd(true));
  };
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
