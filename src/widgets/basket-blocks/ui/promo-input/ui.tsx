import { Input } from "@/shared/ui/input";
import React from "react";

import style from "./promo-input.module.scss";

const PromoInput = () => {
  return (
    <div className={style.root}>
      <input className="input-reset" type="text" placeholder="Промокод" />
      <p>
        Чтобы воспользоваться скидкой введите <br /> промокод
      </p>
    </div>
  );
};

export default PromoInput;
