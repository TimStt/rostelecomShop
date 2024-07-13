import Image from "next/image";
import React, { useCallback, useEffect, useLayoutEffect } from "react";
import style from "./menu.module.scss";
import cls from "classnames";

import { menuItems } from "./item-menu.data";

import Icon from "@/shared/ui/icon";
import { Logo } from "@/shared/ui/logo";
import Modal from "@/shared/ui/modal";
import { useDispatch, useSelector } from "react-redux";
import { closeAllMenus, setIsOpenMenus } from "./store/slice";
import { MenuItems } from "./ui/menu-items";
import { useWatch } from "@/shared/lib/modal/useWatch";
import { useOpen } from "@/shared/lib/modal";
import {
  selectIsModal,
  toggleModalMenu,
} from "@/shared/stores/menu-catalog-modal";
import { useGetStateOnLocalStorage } from "@/shared/hooks/use-get-state-LS";

export const Menu = () => {
  const modalRef = React.createRef<HTMLDialogElement>();
  const modalInnerRef = React.createRef<HTMLDivElement>();
  const isOpenModal = useSelector(selectIsModal);
  const dispatch = useDispatch();
  const level = 1;
  // const [isOpenMenu, setIsOpenMenu] = useState(new Array(numberOfDropDown).fill(false));

  useOpen(isOpenModal, modalRef);

  const closeModal = useCallback(() => {
    dispatch(toggleModalMenu(false));
    dispatch(closeAllMenus());
  }, [dispatch]);

  useGetStateOnLocalStorage(
    "isOpenMenusCatalog",
    (value: Record<string, boolean>) => dispatch(setIsOpenMenus(value))
  );
  useGetStateOnLocalStorage("isOpenMenuModal", (value: boolean) => {
    dispatch(toggleModalMenu(value));
  });

  useWatch(modalInnerRef, closeModal, isOpenModal);

  return (
    <Modal className={style.root} ref={modalRef}>
      <div className={cls("container", style.root__inner)} ref={modalInnerRef}>
        <header className={style.root__header}>
          <Logo className={style.root__logo} onClick={closeModal} />
          <button
            className={cls("btn-reset", style.root__close)}
            onClick={closeModal}
          >
            <Icon name="common/close" />
            <span className="visually-hidden">Закрыть меню</span>
          </button>
        </header>
        <nav>
          <MenuItems
            closeModal={closeModal}
            menuItems={menuItems}
            level={level}
          />
        </nav>
      </div>
      <Image
        className={style.root__bg}
        src="/png/menu_bg.png"
        alt="логотип Rostelecom"
        priority
        width={610}
        height={1017}
      />
    </Modal>
  );
};
