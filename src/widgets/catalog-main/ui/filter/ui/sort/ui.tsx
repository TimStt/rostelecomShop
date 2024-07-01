import React from "react";
import { sortData } from "./data";
import { useRouter } from "next/navigation";
import { Select } from "../../../../../../shared/ui/select";
import style from "./sort.module.scss";

import { useUrlParams } from "@/shared/utils/url";

const Sort = () => {
  const { push } = useRouter();
  const { pathname, params } = useUrlParams();
  const sort = params.get("sort");

  const dataList = Object.values(sortData).map((item) => item.ru);

  const value = Object.entries(sortData).find(
    ([_, value]) => value.nameBySort === sort
  )?.[1].ru;

  const handleChange = (value: string) => {
    const sortProperty = sortData.find((item) => item.ru === value)?.nameBySort;
    if (!sortProperty) return;

    params.set("sort", sortProperty);

    push(`${pathname}?${params}`);
  };

  return (
    <Select
      classname={style.root__select}
      onChange={(value) => handleChange(value)}
      value={sort ? value : ""}
      dataList={dataList}
      title="Сортировать"
      placeholder="Сортировать"
      hiddenTextOption="Сортировать по"
      type="single"
    />
  );
};

export default Sort;
