import React, { use, useState } from "react";
import style from "./payments.module.scss";
import {
  IStatesTabPayment,
  IStatesTypePayment,
  ITabsButtonsOrder,
} from "@/shared/config/types/ui";
import cls from "classnames";
import { TitleBlock } from "../title-block";
import {
  motionSettingsVisibleDisplay,
  motionSettingsVisibleOpacity,
} from "@/shared/ui/ModalMotion";
import { TabsButtons } from "../tabs-buttons";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsStatesTypePayment,
  toggleStateTabs,
} from "@/shared/stores/order";
import { motion } from "framer-motion";
import { selectIsStatesTabPayment } from "@/shared/stores/order/slice";
import CheckboxOrder from "../checkbox-order/ui";
import { useGetStateOnLocalStorage } from "@/shared/hooks/use-get-state-LS";
import { motionSettingsVisibleNoScaleDisplay } from "@/shared/ui/ModalMotion/motion-settings";
import Link from "next/link";

const Payments = () => {
  const statesTypePay = useSelector(selectIsStatesTypePayment);
  const statesTabPay = useSelector(selectIsStatesTabPayment);

  const userCard = "5555 5555 5555 5555";

  const onClickTab = (activeTab: "tabOne" | "tabTwo") => {
    dispatch(
      toggleStateTabs({
        state: "statesTabPayment",
        key: activeTab == "tabOne" ? "online" : "cash",
      })
    );
    dispatch(
      toggleStateTabs({
        state: "statesTypePayment",
        key: activeTab == "tabOne" ? "cards" : "cashOnOffice",
      })
    );
  };
  const [isTypePayment, setIsTypePayment] = useState("cards");

  // const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  // };

  const onChangeCheckbox = (key: keyof IStatesTypePayment, value: string) => {
    dispatch(toggleStateTabs({ state: "statesTypePayment", key }));
    setIsTypePayment(value);
  };

  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className={style.root}>
      <TitleBlock classname={style.roor__title} number={3} title="Оплата" />
      <div className={style.root__inner}>
        <TabsButtons
          classname={style.root__tabs}
          textOne="Онлайн оплата"
          textTwo="Наличными"
          onClick={onClickTab}
          stateTubOne={statesTabPay.online}
          stateTubTwo={statesTabPay.cash}
        />

        {statesTabPay.online ? (
          <motion.div
            className={style.root__block}
            {...motionSettingsVisibleNoScaleDisplay("online")}
          >
            <span className={style.root__block__text}>
              Выберите способ оплаты онлайн или привяжите карту в{" "}
              <Link href={"/profile"}>личном кабинете</Link>
            </span>

            <form className={style["root__checkbox-group"]}>
              <CheckboxOrder
                checked={statesTypePay.cards || false}
                text={userCard}
                onChange={() => onChangeCheckbox("cards", userCard)}
                value={userCard}
                disabled={statesTypePay.cards}
                icon="payment/mir-pay"
              />
              <CheckboxOrder
                checked={statesTypePay.spb || false}
                text={"QR-код"}
                onChange={() => onChangeCheckbox("spb", "spb")}
                value={"spb"}
                disabled={statesTypePay.spb}
                icon="payment/spb"
              />
              <CheckboxOrder
                checked={statesTypePay.sberPay || false}
                text={"SberPay"}
                onChange={() => onChangeCheckbox("sberPay", "sberPay")}
                value={"sberPay"}
                disabled={statesTypePay.sberPay}
                icon="payment/sber-pay"
              />
            </form>
          </motion.div>
        ) : (
          <motion.div
            className={style.root__block}
            {...motionSettingsVisibleNoScaleDisplay("cash")}
          >
            <form className={style["root__checkbox-group"]}>
              <CheckboxOrder
                checked={statesTypePay.cashOnOffice || false}
                text={"Наличными в офисе или пвз"}
                onChange={() =>
                  onChangeCheckbox("cashOnOffice", "cashOnOffice")
                }
                value={"cashOnOffice"}
                disabled={statesTypePay.cashOnOffice}
              />
              <CheckboxOrder
                checked={statesTypePay.cardOnOffice || false}
                text={"Картой в офисе или пвз"}
                onChange={() =>
                  onChangeCheckbox("cardOnOffice", "cardOnOffice")
                }
                value={"sberPay"}
                disabled={statesTypePay.cardOnOffice}
              />
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Payments;
