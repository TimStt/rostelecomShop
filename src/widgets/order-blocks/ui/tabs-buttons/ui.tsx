import React from "react";
import style from "./tabs-buttons.module.scss";
import { ITabsButtonsOrder } from "@/shared/config/types/ui";
import cls from "classnames";

const TabsButtons = ({
  stateTubOne,
  stateTubTwo,
  onClick,
  textOne,
  textTwo,
  type = "outlined-bottom",
  classname,
}: ITabsButtonsOrder) => {
  return (
    <div className={cls(style.root, style[type], classname)}>
      <button
        className={cls("btn-reset", {
          [style.isActive]: stateTubOne,
        })}
        onClick={() => onClick("tabOne")}
        disabled={stateTubOne}
        aria-disabled={stateTubOne}
        title={textOne}
      >
        {textOne}
      </button>
      <button
        className={cls("btn-reset", {
          [style.isActive]: stateTubTwo,
        })}
        onClick={() => onClick("tabTwo")}
        aria-disabled={stateTubTwo}
        disabled={stateTubTwo}
        title={textTwo}
      >
        {textTwo}
      </button>
    </div>
  );
};

export default TabsButtons;
