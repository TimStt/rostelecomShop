"use client";
import { IUITitleBlockOrder } from "@/shared/config/types/ui";
import style from "./user-order-info.module.scss";
import cls from "classnames";
import { TitleBlock } from "../title-block";
import { Input } from "@/shared/ui/input";
import { userInfoData } from "./user-info.data";

const UserOrderInfo = () => {
  return (
    <div className={style.root}>
      <TitleBlock
        classname={style.titleBlock}
        title="Информация о заказе"
        number={4}
      />
      <div className={style.root__inner}>
        <span className={style.root__text}>
          Ввведите данные получателя заказа
        </span>
        <form className={style.root__inner__form}>
          {Object.entries(userInfoData).map(([key, value]) => (
            <Input
              className={style.root__inner__input}
              key={key}
              type={value.key === "phone" ? "tel" : "text"}
              as={value.key === "orderComment" ? "textarea" : "input"}
              variant="input-found"
              placeholder={value.placeholder}
              name={value.key}
            />
          ))}
        </form>
      </div>
    </div>
  );
};

export default UserOrderInfo;
