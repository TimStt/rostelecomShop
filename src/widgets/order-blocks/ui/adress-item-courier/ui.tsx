import { Button } from "@/shared/ui";
import React, { use } from "react";
import style from "./address-item-courier.module.scss";
import { IRostelecomOfficeByCityData } from "@/shared/config/types/geo";
import { useDispatch, useSelector } from "react-redux";
import {
  selectChooseOfficeAddress,
  selectDataAddressCourier,
  selectIsChooseCourierAddress,
  selectLoadingGeolacationData,
  setChooseAddressCourier,
  setChooseOfficeAddress,
  setIsMapModalOpen,
  setLoadListGeoDataOffice,
  setShowCourierAddress,
  setShowCourierAddressData,
  toggleStateTabs,
} from "@/shared/stores/order";
import { PulseLoader } from "@/shared/ui/pulse-loader";

const AddressItemCourier = ({ hasButton }: { hasButton?: boolean }) => {
  const dispatch = useDispatch<AppDispatch>();
  const chooseAddressCourier = useSelector(selectDataAddressCourier);
  const loadingGeolacationData = useSelector(selectLoadingGeolacationData);

  const handleSelectAddress = () => {
    dispatch(setLoadListGeoDataOffice(false));
    dispatch(setChooseOfficeAddress({}));
    dispatch(setShowCourierAddress(true));

    // dispatch(
    //   toggleStateTabs({
    //     state: "statesDeliveryTub",
    //     key: "courierDelivery",
    //   })
    // );
    chooseAddressCourier &&
      dispatch(setChooseAddressCourier(chooseAddressCourier));
    dispatch(setIsMapModalOpen(false));
  };
  return (
    <div className={style.root}>
      {!loadingGeolacationData ? (
        <>
          <h4 className={style.root__title}>
            {chooseAddressCourier?.address_line1}
          </h4>
          <span>{chooseAddressCourier?.address_line2}</span>
          <span>
            Долгота <strong>{chooseAddressCourier?.lon}</strong>
          </span>
          <span>
            Широта <strong>{chooseAddressCourier?.lat}</strong>
          </span>
          <span className={style.root__warning}>
            Будьте внимательны, доставка будет осуществлена по выбранной точке
            на карте!
          </span>
          {hasButton && (
            <Button
              className={style.root__button}
              size="small"
              onClick={handleSelectAddress}
              title="Выбрать адрес доставки"
            >
              Выбрать
            </Button>
          )}
        </>
      ) : (
        <>
          <PulseLoader size={10} color="#fff" />
        </>
      )}
    </div>
  );
};

export default AddressItemCourier;
