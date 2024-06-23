import React, { memo, useEffect, useId, useMemo, useState } from "react";
import style from "./select.module.scss";
import cls from "classnames";
import Icon from "@/shared/ui/icon";
import { useWatch } from "@/shared/lib/modal";
import { ISelectUI } from "@/shared/config/types/ui";
import { Option } from "./ui/option";

const Select = ({
  dataList,
  type,
  onChange,
  value,
  title,
  hiddenTextOption,
  placeholder,
  classname,
}: ISelectUI) => {
  const idButton = useId();
  const [isOpenList, setIsOpenList] = useState(false);
  const refWrapper = React.useRef<HTMLDivElement>(null);

  useWatch(refWrapper, () => setIsOpenList(false), isOpenList);

  const refDropDown = React.useRef<HTMLUListElement>(null);

  return (
    <div className={cls(classname, style.root)} ref={refWrapper}>
      <button
        className={cls(style.root__button, "btn-reset")}
        onClick={() => setIsOpenList(!isOpenList)}
        title={title || "Выбрать"}
        aria-haspopup="listbox"
        id={idButton}
        aria-expanded={isOpenList}
      >
        <div className={style.root__button__text}>
          <span
            className={cls(style.root__placholder, {
              [style.isNotEmpty]: value?.length,
            })}
          >
            {placeholder}
          </span>
          {!!value && (
            <span className={style.root__selected}>
              {value.replace(/,/g, ", ")}
            </span>
          )}
        </div>

        <Icon
          className={cls(style.root__icon, {
            [style.isRotate]: isOpenList,
          })}
          name="common/arrow2"
        />
      </button>
      <ul
        className={cls(style.root__list, { [style.isOpen]: isOpenList })}
        role="listbox"
        aria-labelledby={idButton}
        ref={refDropDown}
      >
        {dataList.map((item, index) => (
          <Option
            key={`${item}-${index}`}
            item={item}
            index={index}
            type={type}
            onChange={onChange}
            value={value}
            hiddenTextOption={hiddenTextOption}
          />
        ))}
      </ul>
    </div>
  );
};

export default Select;
