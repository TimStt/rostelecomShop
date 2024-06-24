import { Button } from "@/shared/ui";
import { BreadCrumb } from "@/shared/ui/breadcrumbs";
import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./compare-page.module.scss";
import {
  deleteAllProductsCompareThunk,
  getProductsCompareThunk,
  selectCompareGoods,
  selectLoadingCompare,
} from "@/shared/stores/compare";
import cls from "classnames";
import { Spinner } from "@/shared/ui/spinner";
import EmptyPageContent from "@/shared/ui/empty-page-content/ui";
import { Select } from "@/shared/ui/select";
import { translateToWord } from "@/shared/utils/translateToWord";
import { useRouter } from "next/router";
import CompereCard from "@/widgets/compare-card-product/ui";

const ComparePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const dataCompareProducts = useSelector(selectCompareGoods);
  const loadingProducts = useSelector(selectLoadingCompare);
  const listCategoryEngLang = Array.from(
    new Set(dataCompareProducts?.map((item) => item.category))
  );
  const listCategoryRuLang = listCategoryEngLang.map((item) =>
    translateToWord({ word: item, lang: "ru" })
  );

  const handleChange = (value: string) => {
    const categorySelect = translateToWord({ word: value, lang: "en" });

    router.push(`/compare/${categorySelect === "all" ? "" : categorySelect}`);
  };

  useEffect(() => {
    if (!router.query.category) {
      dispatch(getProductsCompareThunk());

      return;
    }

    dispatch(getProductsCompareThunk(router.query.category as string));
  }, [dispatch, router.query.category]);

  return (
    <section className={cls(styles.root, "container")}>
      {!loadingProducts ? (
        <>
          {!!dataCompareProducts?.length ? (
            <>
              <div className={styles.root__top}>
                <BreadCrumb className={styles.root__urlNav} />
                <Button
                  size="small"
                  onClick={() => dispatch(deleteAllProductsCompareThunk())}
                >
                  Очистить все
                </Button>
              </div>

              <h1 className={styles.root__title}>
                Сравнение Товаров
                <span> Товаров: {dataCompareProducts?.length}</span>
              </h1>
              {!router.query.category && (
                <Select
                  classname={styles.root__select}
                  dataList={listCategoryRuLang}
                  onChange={handleChange}
                  value={
                    router.query.category
                      ? translateToWord({
                          word: router.query.category as string,
                          lang: "ru",
                        })
                      : ""
                  }
                  title="Выберите категорию по которой вы хотите сравнить товары"
                  placeholder="Сравнение товаров по категории"
                  type="single"
                />
              )}
              <ul className={styles.root__productList}>
                {dataCompareProducts?.map((item) => (
                  <li key={item._id}>
                    <CompereCard product={item} />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <EmptyPageContent
              title={"Ой... </br> Кажется здесь ещё пусто..."}
              subtitle={"В сравнении ничего нет"}
              discription="Мы уверены что в нашем каталоге </br> вы найдете то, что вам понравится!"
              buttonText={"Вернуться в каталог"}
              backgroundText={"Пусто"}
              srcImage="/empty-page/not-found.png"
            />
          )}
        </>
      ) : (
        <Spinner size={50} />
      )}
    </section>
  );
};

export default ComparePage;
