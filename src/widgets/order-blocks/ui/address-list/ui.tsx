import React from "react";
import style from "./address-list.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  selectChooseOfficeAddress,
  selectIsLoadListGeoDataOffice,
  selectIsLoadingOfficeGeoData,
  selectOfficeGeoData,
  setChooseOfficeAddress,
  setLoadListGeoDataOffice,
} from "@/shared/stores/order";
import {
  IBbox,
  IGetGeolocationUser,
  IRostelecomOfficeByCityData,
  handlerSelectAdress,
} from "@/shared/config/types/geo";
import { PulseLoader } from "@/shared/ui/pulse-loader";
import cls from "classnames";
import { useUpdateMap } from "@/features/order-logic/use-update-map";
import { AddressItem } from "../address-item";

const AddressList = ({
  className,
  handlerSelectAddresByMarkers,
}: {
  className?: string;
  handlerSelectAddresByMarkers?: (arg: handlerSelectAdress) => Promise<void>;
}) => {
  const officeAddressesData = useSelector(selectOfficeGeoData);
  const loadingAddressList = useSelector(selectIsLoadingOfficeGeoData);
  const loadAddressData = useSelector(selectIsLoadListGeoDataOffice);
  const chooseAddressCourier = useSelector(selectChooseOfficeAddress);

  const dispatch = useDispatch<AppDispatch>();

  const { handleUpdateMap } = useUpdateMap();

  const handleChooseAddress = (
    address: Partial<IRostelecomOfficeByCityData>
  ) => {
    dispatch(setChooseOfficeAddress(address));
    dispatch(setLoadListGeoDataOffice(false));
  };
  return (
    <>
      <>
        {loadAddressData ? (
          <>
            {loadingAddressList ? (
              <PulseLoader
                className={style.root__loader}
                color="#fff"
                size={11}
              />
            ) : (
              <ul className={cls(style.root, className)}>
                {!!officeAddressesData?.length ? (
                  officeAddressesData?.map((item) => (
                    <li key={item.place_id}>
                      <AddressItem
                        address={item}
                        handleChooseAddress={handleChooseAddress}
                        handleUpdateMap={
                          handlerSelectAddresByMarkers || handleUpdateMap
                        }
                      />
                    </li>
                  ))
                ) : (
                  <span className={style.root__empty}>
                    {" "}
                    К сожалению, не найдено адресов 😢
                  </span>
                )}
              </ul>
            )}
          </>
        ) : (
          !!chooseAddressCourier?.address_line1 &&
          !loadAddressData && <AddressItem address={chooseAddressCourier} />
        )}
      </>
    </>
  );
};

export default AddressList;
