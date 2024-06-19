import React, { use, useId } from "react";
import style from "./checkbox-order.module.scss";
import cls from "classnames";
import { IUICheckboxOrder } from "@/shared/config/types/ui";
import Icon from "@/shared/ui/icon";

const CheckboxOrder = ({
  icon,
  text,
  checked,
  onChange,
  value,
  disabled,
}: IUICheckboxOrder) => {
  const idKey = useId();
  return (
    <label
      className={cls(style.root, {
        [style.isChecked]: checked,
      })}
      htmlFor={idKey}
    >
      <input
        className={cls(style.root__checkbox, "input-reset")}
        type="radio"
        value={value}
        id={idKey}
        checked={checked}
        onChange={() => onChange(!checked)}
        disabled={disabled}
      />

      <div
        className={cls(style.root__block, {
          [style.hasIcon]: icon,
        })}
      >
        {icon && <Icon className={style[icon.split("/")[1]]} name={icon} />}
        <span>{text}</span>
      </div>
    </label>
  );
};

export default CheckboxOrder;
