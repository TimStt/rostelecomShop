"use client";
import { IUITitleBlockOrder } from "@/shared/config/types/ui";
import style from "./title-block.module.scss";
import cls from "classnames";

const TitleBlock = ({ number, title, classname }: IUITitleBlockOrder) => {
  return (
    <div className={cls(style.root, classname)}>
      <span> {number}</span>
      <h2>{title}</h2>
    </div>
  );
};

export default TitleBlock;
