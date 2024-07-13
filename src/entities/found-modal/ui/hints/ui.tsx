import { IFoundAllGoodsApi } from "@/shared/config/types/goods";
import debounce from "@/shared/utils/debounce/util";
import { translateToWord } from "@/shared/utils/translateToWord";
import { typesCategories } from "@/widgets/catalog-main/ui/filter/ui/category-filter/data";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFoundedProductsThunk,
  selectModalFound,
  setCategory,
  setFoundedProducts,
  setLoadingFound,
  setSearchValue,
  setType,
} from "../../store";
import style from "./hints.module.scss";
import cls from "classnames";

const Hints = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { searchValue, type, category } = useSelector(selectModalFound);

  const handlerClick = ({ type, category }: IFoundAllGoodsApi) => {
    dispatch(setLoadingFound(true));
    foundProducts({ type, category });
  };

  const foundProducts = debounce(({ type, category }: IFoundAllGoodsApi) => {
    type = type;
    dispatch(setType(type || ""));
    dispatch(setCategory(category || ""));
    if (!type?.length && !category?.length) {
      dispatch(setFoundedProducts([]));
      return;
    }
    dispatch(
      getFoundedProductsThunk({
        value: searchValue,
        type: type,
        category: category,
      })
    );
  }, 1000);
  return (
    <div className={style.root}>
      <div className={style.root__block}>
        {Object.keys(typesCategories).map((key) => (
          <button
            className={cls(style.root__button, "btn-reset", {
              [style.isActive]: key === category,
            })}
            key={key}
            onClick={() =>
              handlerClick({ type: "", category: key === category ? "" : key })
            }
            title={`Искать ${translateToWord({ word: key, lang: "ru" })}`}
          >
            {translateToWord({ word: key, lang: "ru" })}
          </button>
        ))}
      </div>
      <div className={style.root__block}>
        {Object.values(typesCategories).map((value) =>
          Object.keys(value).map((key) => (
            <button
              className={cls(style.root__button, "btn-reset", {
                [style.isActive]: key === type,
              })}
              key={key}
              onClick={() =>
                handlerClick({ type: key === type ? " " : key, category: " " })
              }
              title={`Искать ${translateToWord({ word: key, lang: "ru" })}`}
            >
              {translateToWord({ word: key, lang: "ru" })}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Hints;
