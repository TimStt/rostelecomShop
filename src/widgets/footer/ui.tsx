import React from "react";
import style from "./_footer.module.scss";

import { Logo } from "@/shared/ui/logo";
import Link from "next/link";
import { useMediaQuery } from "@/shared/hooks/use-media-query";
import cls from "classnames";
import Icon from "@/shared/ui/icon";

const Footer = () => {
  const isMedia800 = useMediaQuery(800);
  const isMedia480 = useMediaQuery(480);
  return (
    <footer className={style.root}>
      <div className={cls(style.root__top)}>
        <div className={cls(style.root__top__wrapper, "container")}>
          <Logo className={style.root__top__logo} />
          <ul className={style.root__top__contacts}>
            <li>
              <a href="tel:+74999998283">+7 (499) 999-82-83</a>

              <a href="mailto:rostelecom.merc@rt.ru">rostelecom.merc@rt.ru</a>
            </li>
            <li>
              <a href="tel:+74999998283">vc.ru</a>

              <a href="mailto:rostelecom.merc@rt.ru">habr.com</a>
            </li>
          </ul>

          <ul className={style.root__socials}>
            <li className={cls(style.root__socials__item, style.telegram)}>
              <a href="https://t.me/dvejer">
                <Icon name="social/telegram" />
              </a>
            </li>
            <li className={cls(style.root__socials__item, style.vk)}>
              <a href="https://vk.com">
                <Icon name="social/vk" />
              </a>
            </li>
            <li className={cls(style.root__socials__item, style.youtube)}>
              <a href="https://www.youtube.com/channel/UC-bKY9X9yK-ZKJKf-w1Q0bQ">
                <Icon name="social/youtube" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className={style.root__bottom}>
        <div className={cls(style.root__bottom__wrapper, "container")}>
          <p className={style.root__bottom__copyright}>
            © 2023 ПАО © 2023 ПАО «Ростелеком» Все права защищены
            <br />
            (18+)
          </p>
          <div className={style.root__bottom__policy}>
            <Link href="/personal-data-policy">Политика обработки данных</Link>
            <Link href="/privacy-policy">Политика конфиденциальности</Link>
          </div>
          <span>{isMedia480 ? "Полная версия" : "Мобильная версия"}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
