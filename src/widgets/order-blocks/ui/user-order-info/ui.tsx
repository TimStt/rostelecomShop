"use client";
import { IUIInfoUserOrder, IUITitleBlockOrder } from "@/shared/config/types/ui";
import style from "./user-order-info.module.scss";
import cls from "classnames";
import { TitleBlock } from "../title-block";
import { Input } from "@/shared/ui/input";
import { userInfoData } from "./user-info.data";
import { useForm } from "react-hook-form";
import { InputPhone } from "./ui/input-phone";
import InputTextarea from "./ui/input-textarea/ui";
import { InputEmail } from "./ui/input-email";
import { InputLastName } from "./ui/input-lastname";
import { InputName } from "./ui/input-name";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsValidOrderInfo,
  selectUserOrderInfo,
  setIsValidOrderInfo,
} from "@/shared/stores/order";
import { useEffect } from "react";
import { set } from "mongoose";

const UserOrderInfo = () => {
  const {
    register,
    handleSubmit,
    control,
    trigger,

    formState: { errors, isValid },
  } = useForm<IUIInfoUserOrder>();

  const dispatch = useDispatch();
  const isValidOrderInfo = useSelector(selectIsValidOrderInfo);

  useEffect(() => {
    if (isValidOrderInfo === isValid) return;
    dispatch(setIsValidOrderInfo(isValid));
  }, [dispatch, isValid, isValidOrderInfo]);

  console.log("isValid", isValid);

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
          <InputName
            classname={style.root__inner__input}
            register={register}
            control={control}
            errors={errors}
            trigger={trigger}
          />
          <InputLastName
            classname={style.root__inner__input}
            register={register}
            control={control}
            errors={errors}
            trigger={trigger}
          />
          <InputPhone
            classname={style.root__inner__input}
            register={register}
            control={control}
            errors={errors}
            trigger={trigger}
          />

          <InputEmail
            classname={style.root__inner__input}
            register={register}
            control={control}
            errors={errors}
            trigger={trigger}
          />
          <InputTextarea
            classname={style.root__inner__input}
            register={register}
            control={control}
            errors={errors}
            trigger={trigger}
          />
        </form>
      </div>
    </div>
  );
};

export default UserOrderInfo;
