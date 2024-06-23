import { IUIAddressItem } from "@/shared/config/types/ui";
import React from "react";
import style from "./address-item.module.scss";
import { useDispatch } from "react-redux";
import {
  selectChooseOfficeAddress,
  setChooseAddressCourier,
} from "@/shared/stores/order";
import { set } from "mongoose";
import { IBbox } from "@/shared/config/types/geo";

const AddressItem = ({
  address,
  handleUpdateMap,
  handleChooseAddress,
}: IUIAddressItem) => {
  const dispatch = useDispatch<AppDispatch>();
  const hasMehods = !!handleChooseAddress && !!handleUpdateMap;

  const selectAddress = () => {
    if (hasMehods) {
      dispatch(setChooseAddressCourier({}));

      handleChooseAddress(address);
      handleUpdateMap({
        position: { lat: address.lat as number, lon: address.lon as number },
        box: address.bbox as IBbox,
      });
    }
  };

  return (
    <div className={style.root} onClick={hasMehods ? selectAddress : undefined}>
      <h3 className={style.root__title}>{address.address_line1}</h3>
      <span className={style.root__text}>{address.address_line2}</span>
    </div>
  );
};

export default AddressItem;
