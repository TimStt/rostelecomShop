import React, { MutableRefObject, useCallback, useEffect, useRef } from "react";
import style from "./map-modal.module.scss";
import { mapOption } from "@/shared/config/constants/map-option";
import { ModalMotion } from "@/shared/ui/ModalMotion";
import { useWatch } from "@/shared/lib/modal";
import { useScrollHidden } from "@/shared/lib/modal/useScrollHidden";
import { useDispatch, useSelector } from "react-redux";
import {
  getOfficeByCity,
  selectChooseOfficeAddress,
  selectIsChooseCourierAddress,
  selectIsStatesDeliveryTub,
  selectMapOrder,
  selectOfficeGeoData,
  selectOpenMapModal,
  setChooseAddressCourier,
  setIsMapModalOpen,
  setLoadListGeoDataOffice,
  setShowCourierAddressData,
  toggleStateTabs,
} from "@/shared/stores/order";

import { motionSettingsVisibleNoScaleDisplay } from "@/shared/ui/ModalMotion/motion-settings";
import { TabsButtons } from "../tabs-buttons";

import cls from "classnames";
import { AddressList } from "../address-list";
import { motion } from "framer-motion";
import { Button } from "@/shared/ui";
import {
  IBbox,
  IGetGeolocationUser,
  IGetRostelecomOfficeByCity,
  IRostelecomOfficeByCityData,
  handlerSelectAdress,
} from "@/shared/config/types/geo";
import { useUpdateMap } from "@/features/order-logic/use-update-map";
import { selectUser } from "@/shared/stores/user";
import {
  handleResultClearing,
  handleResultSelection,
  handleResultsFound,
  useHandleSelectPickUpAddress,
  SearchMarkersManager,
} from "@/shared/utils/map";
import { set } from "mongoose";
import { unwrapResult } from "@reduxjs/toolkit";

const MapModal = () => {
  const searchBoxHTML = useRef() as MutableRefObject<HTMLDivElement>;
  const refMapPickUp = useRef() as MutableRefObject<HTMLDivElement>;
  const refMapCourier = useRef() as MutableRefObject<HTMLDivElement>;
  const refModal = useRef<HTMLDialogElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [isMapInstance, setIsMapInstance] = React.useState<any>();
  const isStateModal = useSelector(selectOpenMapModal);
  const statesTubs = useSelector(selectIsStatesDeliveryTub);
  const shouldLoadMap = useRef(true);
  const handleSelectPickUpAddress = useHandleSelectPickUpAddress();
  const { userGeolacation } = useSelector(selectUser);
  const chooseAddressCourier = useSelector(selectIsChooseCourierAddress);
  const dataOfficesGeoByCity = useSelector(selectOfficeGeoData);
  const choosenPickUpAddress = useSelector(selectChooseOfficeAddress);

  useEffect(() => {
    if (isStateModal && !refMapPickUp.current.firstChild) {
      loadMap();
    }
  }, [isStateModal]);

  const toggletabClick = (activeTab: "tabOne" | "tabTwo") => {
    dispatch(
      toggleStateTabs({
        state: "statesDeliveryTub",
        key: activeTab === "tabOne" ? "selfDelivery" : "courierDelivery",
      })
    );
    if (activeTab === "tabOne") {
      //   if (choosenPickUpAddress?.address_line1) {
      //     handleLoadMap(
      //       choosenPickUpAddress.city,
      //       {
      //         lat: choosenPickUpAddress.lat as number,
      //         lng: choosenPickUpAddress.lon as number,
      //       },
      //       true
      //     );
      //     return;
      //   }
      //   if (!!userGeolacation?.features[0].properties?.city?.length) {
      //     handleLoadMap(userGeolacation.features[0].properties.city);
      //     return;
      //   }
      loadMap();
      return;
    }
  };
  const mapInstance = useSelector(selectMapOrder);
  const closeModal = useCallback(() => {
    dispatch(setIsMapModalOpen(false));
    setTimeout(() => refModal.current?.close(), 1000);
  }, [dispatch]);

  const loadMap = async (initialContainerMap = refMapPickUp) => {
    if (!isStateModal) return;
    const ttmap = await import("@tomtom-international/web-sdk-maps");
    const map = ttmap.map({
      key: `${process.env.NEXT_PUBLIC_TOMTOM_API_KEY}`,
      container: initialContainerMap.current,
      language: "ru",
      center: {
        lat: 55.755819,
        lng: 37.617644,
      },
      // zoom: 15,
    });

    if (
      !searchBoxHTML.current ||
      initialContainerMap.current.firstChild !== searchBoxHTML.current
    ) {
      //@ts-ignore
      const ttSearchBox = new tt.plugins.SearchBox(
        //@ts-ignore
        tt.services,
        mapOption
      );
      //    !!searchVelue.length && ttSearchBox.setValue(searchVelue);
      //    !marker &&
      //      !!userGeolacation?.features[0].properties.city?.length &&
      //      ttSearchBox.setValue(userGeolacation.features[0].properties.city);

      searchBoxHTML.current = ttSearchBox.getSearchBoxHTML();
      searchBoxHTML.current.classList.add("modal__search-input");

      initialContainerMap.current.appendChild(searchBoxHTML.current);
      initialContainerMap.current.appendChild(searchBoxHTML.current);
      //@ts-ignore
      const searchMarkersManager = new SearchMarkersManager(map);
      const nav = new ttmap.NavigationControl({});
      map.addControl(nav, "bottom-right");

      map.addControl(
        new ttmap.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        }),
        "bottom-left"
      );

      const setMarkersByLocationData = (
        data: IRostelecomOfficeByCityData[]
      ) => {
        data.forEach((item) => {
          const southwest = new ttmap.LngLat(item.bbox.lon1, item.bbox.lat1);
          const northeast = new ttmap.LngLat(item.bbox.lon2, item.bbox.lat2);

          const bounds = new ttmap.LngLatBounds(southwest, northeast);

          const elementMarker = document.createElement("div");
          elementMarker.classList.add("modal-map-marker");

          map.fitBounds(bounds, {
            padding: 130,
            linear: true,
          });

          new ttmap.Marker({
            element: elementMarker,
          })
            .setLngLat([item.lon, item.lat])
            .addTo(map.zoomTo(10));
        });
      };

      //@ts-ignore
      //   ttSearchBox.on("tomtom.searchbox.resultselected", async (e) => {
      //     const data = await handleSelectPickUpAddress(e.data?.result);

      //     // handleResultSelection(
      //     //   e,
      //     //   searchMarkersManager,
      //     //   map,
      //     //   handleSelectPickUpAddress
      //     // );
      //     data && setMarkersByLocationData(data);
      //   });

      ttSearchBox.on("tomtom.searchbox.resultscleared", () => {
        handleResultClearing(
          searchMarkersManager,
          map,
          userGeolacation,
          handleSelectPickUpAddress
        );
        handleResultClearing(
          searchMarkersManager,
          mapInstance,
          userGeolacation,
          handleSelectPickUpAddress
        );
      });

      //@ts-ignore
      ttSearchBox.on("tomtom.searchbox.resultsfound", (e) =>
        handleResultsFound(e, searchMarkersManager, map)
      );
      setIsMapInstance(map);
      if (!!choosenPickUpAddress?.address_line1) {
        console.log("choosenPickUpAddress", choosenPickUpAddress);
        const chosenItem = dataOfficesGeoByCity?.filter(
          (item) => item.address_line2 === choosenPickUpAddress.address_line2
        )[0];

        // dispatch(setLoadListGeoDataOffice(false));
        if (!chosenItem) return;
        setMarkersByLocationData([chosenItem]);

        map.setCenter([chosenItem.lon, chosenItem.lat]).zoomTo(12);
        ttSearchBox.setValue(chosenItem.city);

        return;
      }
      const cityUser = userGeolacation?.features[0]?.properties?.city;
      if (!cityUser) {
        const data = await handleSelectPickUpAddress("москва");
        data && setMarkersByLocationData(data);
        ttSearchBox.setValue("Москва");
      } else {
        map
          .setCenter([
            userGeolacation?.features[0].properties.lon as number,
            userGeolacation?.features[0].properties.lat as number,
          ])
          .zoomTo(10);
        ttSearchBox.setValue(cityUser);
      }

      if (dataOfficesGeoByCity?.length) {
        setMarkersByLocationData(dataOfficesGeoByCity);
      }
    }
  };

  useScrollHidden(isStateModal);
  const { handleUpdateMap } = useUpdateMap();
  const removeMapMarkers = () => {
    const markers = document.querySelectorAll(".modal-map-marker");
    markers.forEach((marker) => {
      marker.remove();
    });
  };

  const handlerSelectAddresByMarkers = async ({
    position,
    box,
  }: handlerSelectAdress) => {
    const { lon1, lat1, lon2, lat2 } = box;
    removeMapMarkers();
    handleUpdateMap({
      position: position,
      box: { lon1, lat1, lon2, lat2 },
      initialMapInstance: mapInstance,
    });
    handleUpdateMap({
      position: position,
      box: { lon1, lat1, lon2, lat2 },
      initialMapInstance: isMapInstance,
    });
    dispatch(setShowCourierAddressData(false));
    dispatch(setChooseAddressCourier({}));
    // closeModal();
  };

  return (
    <ModalMotion className={style.root} ref={refModal} state={isStateModal}>
      <div className={style.root__wrapper}>
        <aside className={style.root__aside}>
          <h3 className={style.root__aside__title}>
            {" "}
            Выберите способ доставки
          </h3>
          <TabsButtons
            classname={style.root__tabs}
            textOne="Самовывоз (Бесплатно)"
            textTwo="Доставка курьером"
            onClick={toggletabClick}
            stateTubOne={statesTubs.selfDelivery}
            stateTubTwo={statesTubs.courierDelivery}
            type="painted"
          />

          {statesTubs.selfDelivery && (
            <motion.div
              className={style.root__selfDelivery}
              {...motionSettingsVisibleNoScaleDisplay("selfDelivery__modal")}
            >
              <AddressList
                className={style.root__selfDelivery__list}
                handlerSelectAddresByMarkers={handlerSelectAddresByMarkers}
              />
            </motion.div>
          )}
          {statesTubs.courierDelivery && (
            <motion.div
              className={style.root__courierDelivery}
              {...motionSettingsVisibleNoScaleDisplay("courierDelivery__modal")}
            >
              {!!chooseAddressCourier?.address_line1 ? (
                <>
                  {" "}
                  <h4 className={style.root__courierDelivery__title}>
                    {chooseAddressCourier.address_line1}
                  </h4>
                  <span>{chooseAddressCourier.address_line2}</span>
                  <span>
                    Долгота <strong>{chooseAddressCourier.lon}</strong>
                  </span>
                  <span>
                    Широта <strong>{chooseAddressCourier.lat}</strong>
                  </span>
                  <span className={style.root__courierDelivery__warning}>
                    Будьте внимательны, доставка будет осуществлена по выбранной
                    точке на карте!
                  </span>
                  <Button
                    className={style.root__courierDelivery__button}
                    size="small"
                    onClick={() => dispatch(setIsMapModalOpen(false))}
                  >
                    Выбрать
                  </Button>
                </>
              ) : (
                <span>Выберите адрес</span>
              )}
            </motion.div>
          )}
        </aside>
        {statesTubs.selfDelivery && (
          <div className={style.root__map} ref={refMapPickUp} />
        )}
        {statesTubs.courierDelivery && (
          <div className={style.root__map} ref={refMapCourier} />
        )}
        <button
          className={cls(style.root__close, "btn-reset")}
          onClick={closeModal}
          title="Закрыть окно карты"
        >
          Закрыть{" "}
        </button>
      </div>
    </ModalMotion>
  );
};

export default MapModal;
