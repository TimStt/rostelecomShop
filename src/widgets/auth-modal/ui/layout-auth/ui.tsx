import Modal from "@/shared/ui/modal";
import React, { memo, useCallback, useEffect } from "react";

import style from "./layout-auth.module.scss";
import Icon from "@/shared/ui/icon";

import { TActiveForm } from "@/shared/config/types/auth";
import { IAuthLayout } from "./types";
import { IIconData, iconsData } from "./icons.data";
import { useWatch } from "@/shared/lib/modal";
import { useDispatch, useSelector } from "react-redux";
import { toggleStateModal } from "@/shared/stores/auth-modal";
import cls from "classnames";
import toast, { Toaster } from "react-hot-toast";
import { selectOpenModal } from "@/shared/stores/auth-modal/slice";
import { useFormAuth } from "@/shared/utils/useFormAuth";
import { ModalMotion } from "@/shared/ui/ModalMotion";

const LayoutAuth: React.FC<IAuthLayout> = ({
  children,
  modalRef,
  type,
  classname,
  modalInnerRef,
  closeModal,

  ...props
}) => {
  const DEDAULT_TYPE = {
    isLogin: true,
  };
  const dispatch = useDispatch();
  const isOpenModal = useSelector(selectOpenModal);

  const { handleSignUpWithAuth, earthoError } = useFormAuth();

  // useEffect(() => {
  //   if (earthoError) toast.error(`${earthoError}`);
  // }, [earthoError]);

  type = type || DEDAULT_TYPE;
  return (
    <ModalMotion
      className={cls(style.root)}
      ref={modalRef}
      {...props}
      state={isOpenModal}
      isOpenFlex={true}
    >
      <div>
        <div className={style.root__starsec}></div>
        <div className={style.root__starthird}></div>
        <div className={style.root__starfourth}></div>
        <div className={style.root__starfifth}></div>
      </div>
      <div className={style.root__modal}>
        <div
          className={cls(style.root__inner, "container")}
          ref={modalInnerRef}
        >
          <div className={style.root__header}>
            <h1 className={style.root__title}>
              {type.isLogin ? "Войти" : "Создать аккаунт"}
            </h1>
            <p>{type.isLogin ? "Войти в свой" : "Создать"} аккаунт</p>
            <button
              className={cls(style.root__close, "btn-reset")}
              onClick={closeModal}
            >
              <Icon name="common/close" />
              <span className="visually-hidden">Закрыть окно авторизации</span>
            </button>
          </div>
          {children}
          <ul className={style["root__icons-list"]}>
            {iconsData.map(({ iconName, hiddenText }: IIconData) => (
              <li className={style["root__icons-list__item"]} key={iconName}>
                <button
                  className={cls(
                    style["root__icons-list__icon"],
                    "btn-reset",
                    style[`${iconName.split("/")[1]}`]
                  )}
                  onClick={handleSignUpWithAuth}
                  title={hiddenText}
                >
                  <Icon name={`${iconName}`} />
                  <span className="visually-hidden">{hiddenText}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ModalMotion>
  );
};

LayoutAuth.displayName = "LayoutAuth";

export default LayoutAuth;
