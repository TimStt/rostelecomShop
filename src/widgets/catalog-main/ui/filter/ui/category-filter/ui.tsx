import React, { useCallback, useEffect } from "react";
import style from "./category.module.scss";

import { useDispatch, useSelector } from "react-redux";

import { CategoryData, typesCategories } from "./data";

import { Select } from "../../../../../../shared/ui/select";
import { translateWords } from "@/shared/routing/paths";
import { IfilterState } from "@/shared/config/types/filters";
import { translateToWord } from "@/shared/utils/translateToWord";
import { useUrlParams } from "@/shared/utils/url";
import { useRouter } from "next/router";

const CategoryFilters = () => {
  const router = useRouter();
  const { pathname, params } = useUrlParams();
  const type = params.get("type");

  const hasCategoryParam = Object.keys(CategoryData).find((key) =>
    pathname?.includes(key)
  );

  const typesCategory =
    typesCategories[hasCategoryParam as keyof typeof typesCategories];

  // useEffect(() => {

  //   category && !hasCategoryParam
  //     ? dispatch(deleteFilter({ key: "category" }))
  //     : hasCategoryParam &&
  //       !category &&
  //       dispatch(getFilterSave({ category: params.get("category") as string }));
  // }, [category, dispatch, params, pathname, type]);

  const page = params.get("page");

  const handleSelectChange = (value: string) => {
    value = translateToWord({ word: value, lang: "en" });

    page && page !== "1" && params.set("page", "1");
    if (typesCategory && !params.get(value)) {
      params.set("type", value.replace("_", "-"));

      router.push(`${pathname}?${params}`);
      return;
    }
    // dispatch(getFilterSave({ category: value }));
    router.push(`/catalog/${value}?${params}`);
  };

  const dataList = Object.entries(
    hasCategoryParam ? typesCategory : CategoryData
  ).map(([_, value]) => value);

  return (
    <Select
      classname={style.select}
      onChange={(category: string) => handleSelectChange(category)}
      dataList={dataList}
      value={translateToWord({
        word: (type || hasCategoryParam) as string,
        lang: "ru",
      })}
      type="single"
      title="Фильтровать по категориям"
      placeholder="Категории"
      hiddenTextOption="Фильтровать по категории"
    />
  );
};

export default CategoryFilters;
