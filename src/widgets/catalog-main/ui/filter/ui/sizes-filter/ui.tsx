import React, { useEffect, useRef, useState } from "react";
import { sizesList } from "./data";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import style from "./sizes.module.scss";

import { useUrlParams } from "@/shared/utils/url";
import cls from "classnames";
import Select from "../../../../../../shared/ui/select/ui";

const SizesFilter = () => {
  const { push } = useRouter();

  const { pathname, params } = useUrlParams();
  const sizes = params.get("sizes");

  const changeMultiple = (value: string) => {
    let sizesInput = sizes?.split(",") || [];
    const index = sizesInput?.indexOf(value);

    index !== -1
      ? (sizesInput = sizesInput.filter((_, i) => i !== index))
      : sizesInput.push(value);

    if (!sizesInput.length) {
      params.delete("sizes");
      push(`${pathname}?${params}`);
      return;
    }

    const page = params.get("page");

    page && page !== "1" && params.set("page", "1");
    params.set("sizes", sizesInput?.join(","));

    push(`${pathname}?${params}`);
  };

  return (
    <Select
      classname={style.root__select}
      dataList={sizesList}
      type={"multiple"}
      onChange={(size: string) => changeMultiple(size)}
      value={params.get("sizes") || ""}
      title="Фильровать по размерам"
      hiddenTextOption="Фильтровать по размеру"
      placeholder="Размеры"
    />
  );
};

export default SizesFilter;
