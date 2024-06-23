import React, { useCallback, useEffect, useRef, useState } from "react";
import { selectPopupShareState, toggleStatePopupShare } from "./store";
import { useDispatch, useSelector } from "react-redux";
import { useOpen, useWatch } from "@/shared/lib/modal";
import { useScrollHidden } from "@/shared/lib/modal/useScrollHidden";
import ModalMotion from "@/shared/ui/ModalMotion/ui";
import style from "./popup-share.module.scss";
import Icon from "@/shared/ui/icon";
import cls from "classnames";
import { usePathname } from "next/navigation";
import {
  currentProductAddBusketSlice,
  selectCurrentProductState,
} from "@/shared/stores/current-product-add-busket";

const PopupShare = () => {
  const refModal = useRef<HTMLDialogElement>(null);
  const refWrapper = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isShareUrl, setIsShareUrl] = useState("");

  useEffect(() => {
    setIsShareUrl(window.location.href);
  }, [pathname]);

  const isOpenModal = useSelector(selectPopupShareState);
  const dispatch = useDispatch();
  const currentProduct = useSelector(selectCurrentProductState);
  const closeModal = useCallback(() => {
    dispatch(toggleStatePopupShare(false));
    setTimeout(() => refModal.current?.close(), 1000);
  }, [dispatch]);

  const hrefUrl = encodeURIComponent(isShareUrl);

  useOpen(isOpenModal, refModal);
  useWatch(refWrapper, closeModal);
  useScrollHidden(isOpenModal);

  if (!currentProduct) return null;
  const handleCloseAlert = () => dispatch(toggleStatePopupShare(false));
  const urlVk = `http://vk.com/share.php?url=${hrefUrl}&title=${currentProduct?.name}&description=${currentProduct?.description}&image=${currentProduct?.images[0]}`;
  const urlTelegram = `https://t.me/share/url?url=${hrefUrl}`;

  return (
    <ModalMotion className={style.root} ref={refModal} state={isOpenModal}>
      <div className={style.root__wrapper} ref={refWrapper}>
        <h3 className={style.root__title}>Поделиться</h3>
        <div className={style.root__socials}>
          <a
            className={cls(style.root__socials__button, style.vk)}
            href={urlVk}
          >
            <span className="visually-hidden">Поделиться в VK</span>
            <Icon name="social/vk" />
          </a>
          <a
            className={cls(style.root__socials__button, style.telegram)}
            href={urlTelegram}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="visually-hidden">Поделиться в VK</span>
            <Icon name="social/telegram" />
          </a>
        </div>
        <button
          className={cls("btn-reset", style.root__close)}
          onClick={handleCloseAlert}
        >
          <Icon name="common/close" />
          <span className="visually-hidden">
            Закрыть окно быстрого просмотра
          </span>
        </button>
      </div>
    </ModalMotion>
  );
};

export default PopupShare;
