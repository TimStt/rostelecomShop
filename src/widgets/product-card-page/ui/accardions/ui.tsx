import React from "react";
import style from "./accardions.module.scss";
import { useRef } from "react";

import Icon from "@/shared/ui/icon";
import { TCharacteristicsGoods } from "@/shared/config/types/goods";
import cls from "classnames";

const Accardions = ({
  discription,
  characteristics,
  classname,
}: {
  classname?: string;
  discription?: string;
  characteristics: TCharacteristicsGoods;
}) => {
  return (
    <div className={classname}>
      {" "}
      {discription && (
        <>
          <details className={style.root}>
            <summary
              className={style.root__summary}
              role="term"
              aria-details="content-discription"
              title="Открыть описание товара"
            >
              <span>Описание:</span>
              <Icon name={"common/plus"} />
            </summary>
          </details>
          <div
            className={style.root__content}
            id="content-discription"
            role="definition"
          >
            <div className={style.root__wrapper}>
              <p className={style.root__discription}>{discription}</p>
            </div>
          </div>
        </>
      )}
      <details className={style.root}>
        <summary
          className={style.root__summary}
          role="term"
          aria-details="content-characteristics"
          title="Открыть характеристики товара"
        >
          <span>Характеристики:</span>
          <Icon name={"common/plus"} />
        </summary>
      </details>
      <div
        className={style.root__content}
        id="content-characteristics"
        role="definition"
      >
        <ul className={cls(style.root__wrapper, style.list)}>
          {Object.entries(characteristics).map(([key, value]) => (
            <li key={key} className={style.root__characteristics}>
              <span>
                {key}:{value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Accardions;
