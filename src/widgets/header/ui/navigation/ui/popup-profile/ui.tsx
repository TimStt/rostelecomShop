import style from "./popup-profile.module.scss";
import cls from "classnames";

import { useDispatch, useSelector } from "react-redux";
import Icon from "@/shared/ui/icon";
import Popup from "@/shared/ui/popup";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PulseLoader } from "@/shared/ui/pulse-loader";
import Image from "next/image";

import Link from "next/link";

import { selectUser } from "@/shared/stores/user";
import { paths } from "@/shared/routing";
import { useLogout } from "@/shared/utils/useLogout";
import { useWatch } from "@/shared/lib/modal";
import { selectStatesPopups, togglePopups } from "../../store";
import { useImageProfile } from "@/shared/lib/auth/utils/useImageProfile";
import { toggleStateModal } from "@/shared/stores/auth-modal";
import { selectOpenModal } from "@/shared/stores/auth-modal/slice";
import { selectLoginCheckLoading, setAuth } from "@/shared/stores/auth";
import { Spinner } from "@/shared/ui/spinner";
import { useTriggerLoginCheck } from "@/shared/lib/auth/utils/useTriggerLoginCheck/useTriggerLoginCheck";
import { useUserAuth } from "@/shared/lib/auth/utils/isUserAuth";

const PopupProfile = ({ classname }: { classname: string }) => {
  const { user } = useSelector(selectUser);
  const handleLogout = useLogout();
  const dispatch = useDispatch();
  const { src, alt } = useImageProfile();
  const statesPopup = useSelector(selectStatesPopups);
  const isAuth = useUserAuth();

  const isOpenModal = useSelector(selectOpenModal);
  const openModalAuth = () => {
    dispatch(toggleStateModal(!isOpenModal));
    if (statesPopup.basket) dispatch(togglePopups({ basket: false }));
  };
  const refPopup = useRef<HTMLElement>(null);
  const toggleStatePopup = useCallback(
    (state: boolean) => dispatch(togglePopups({ profile: state })),
    [dispatch]
  );

  console.log(user);

  const isLoadingCheck = useSelector(selectLoginCheckLoading);

  useTriggerLoginCheck();

  const logout = () => {
    handleLogout();
    dispatch(setAuth(false));
  };

  // const handlerPopup = () => setIsOpenPopup((prev) => !prev);
  useWatch(refPopup, () => toggleStatePopup(false), statesPopup.profile);
  // const openModal = () => dispatch(toggleModalFound(true));
  return (
    <>
      {" "}
      {isLoadingCheck ? (
        <PulseLoader size={5} color="#ffffff" gap={4.5} />
      ) : (
        <button
          className={cls(classname, "btn-reset")}
          onClick={
            isAuth
              ? () => dispatch(togglePopups({ basket: false, profile: true }))
              : openModalAuth
          }
        >
          {src ? (
            <Image src={src} alt={alt} width={24} height={24} />
          ) : (
            <Icon name="common/profile" />
          )}
          <span className="visually-hidden">
            {isAuth ? "Открыть попап профиля" : "Войти"}
          </span>
        </button>
      )}
      {isAuth && (
        <Popup
          className={cls(style.root, {
            [style.isOpen]: statesPopup.profile,
          })}
          ref={refPopup}
        >
          <div className={style.root__wrapper}>
            <Link
              className={style.root__text}
              href={paths.profile(user?._id as string)}
            >
              Профиль
            </Link>
            <button
              className={cls("btn-reset", style.root__text)}
              onClick={logout}
            >
              Выйти
            </button>
          </div>
        </Popup>
      )}
    </>
  );
};

PopupProfile.displayName = "PopupProfile";

export default PopupProfile;
