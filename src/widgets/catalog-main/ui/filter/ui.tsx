import React, { useCallback, useRef, useState } from "react";
import style from "./filter.module.scss";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Icon from "@/shared/ui/icon";
import cls from "classnames";
import { CategoryFilters } from "./ui/category-filter";
import { PriceFilter } from "./ui/price-filter";
import { SizesFilter } from "./ui/sizes-filter";
import Sort from "./ui/sort/ui";
import SizesView from "./ui/sizes-view/ui";
import { useGetStateOnLocalStorage } from "@/shared/hooks/use-get-state-LS";
import { useDispatch } from "react-redux";
import { IfilterState } from "@/shared/config/types/filters";

export const Filter = () => {
  // const [isSizes, setIsSizes] = useState<string[]>([]);

  return (
    <div className={style.root}>
      <div className={style.root__inner}>
        <CategoryFilters />
        <PriceFilter />
        <SizesFilter />
        <Sort />
      </div>
      <SizesView />
    </div>
  );
};
