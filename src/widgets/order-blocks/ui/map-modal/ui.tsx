import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import style from "./map-modal.module.scss";
import { mapOption } from "@/shared/config/constants/map-option";
import { ModalMotion } from "@/shared/ui/ModalMotion";
import { useWatch } from "@/shared/lib/modal";
import { useScrollHidden } from "@/shared/lib/modal/useScrollHidden";
import { useDispatch, useSelector } from "react-redux";
import {
  getOfficeByCity,
  selectChooseOfficeAddress,
  selectDataAddressCourier,
  selectIsChooseCourierAddress,
  selectIsLoadListGeoDataOffice,
  selectIsStatesDeliveryTub,
  selectMapOrder,
  selectOfficeGeoData,
  selectOpenMapModal,
  setChooseAddressCourier,
  setChooseOfficeAddress,
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
import { tr } from "@faker-js/faker";
import { AddressItemCourier } from "../adress-item-courier";
import {
  getGeolacation,
  selectShowCourierAddressData,
  setDataCourier,
} from "@/shared/stores/order/slice";

const MapModal = () => {
  const searchBoxHTML = useRef() as MutableRefObject<HTMLDivElement>;
  const refMapPickUp = useRef() as MutableRefObject<HTMLDivElement>;
  const refMapCourier = useRef() as MutableRefObject<HTMLDivElement>;
  const refModal = useRef<HTMLDialogElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [isMapInstance, setIsMapInstance] = React.useState<any>();
  const isStateModal = useSelector(selectOpenMapModal);
  const statesTubs = useSelector(selectIsStatesDeliveryTub);
  const isShouldLoadMap = useRef(true);
  const handleSelectPickUpAddress = useHandleSelectPickUpAddress();
  const { userGeolacation } = useSelector(selectUser);
  const dataAddressCourier = useSelector(selectDataAddressCourier);
  const dataOfficesGeoByCity = useSelector(selectOfficeGeoData);
  const choosenPickUpAddress = useSelector(selectChooseOfficeAddress);
  const showCourierAddressData = useSelector(selectShowCourierAddressData);

  const drawMarker = async (lon: number, lat: number, map: any) => {
    const ttMaps = await import(`@tomtom-international/web-sdk-maps`);

    const element = document.createElement("div");
    element.classList.add("modal-map-marker");

    new ttMaps.Marker({ element }).setLngLat([lon, lat]).addTo(map.zoomTo(12));
  };

  const toggletabClick = async (activeTab: "tabOne" | "tabTwo") => {
    dispatch(
      toggleStateTabs({
        state: "statesDeliveryTub",
        key: activeTab === "tabOne" ? "selfDelivery" : "courierDelivery",
      })
    );
    if (activeTab === "tabOne") {
      loadMap();
      return;
    }
    if (activeTab === "tabTwo") {
      openMapCourier();
    }
  };
  const mapInstance = useSelector(selectMapOrder);
  const loadListGeoDataOffice = useSelector(selectIsLoadListGeoDataOffice);
  const closeModal = useCallback(() => {
    dispatch(setIsMapModalOpen(false));
    isShouldLoadMap.current = true;
    setTimeout(() => refModal.current?.close(), 1000);
  }, [dispatch]);

  const loadMap = useCallback(
    async (initialContainerMap = refMapPickUp) => {
      if (!isStateModal) return;
      try {
        const positionMoscow = { lat: 55.755819, lng: 37.617644 };
        console.log("loadMap");
        if (initialContainerMap.current)
          initialContainerMap.current.innerHTML = "";
        const ttmap = await import("@tomtom-international/web-sdk-maps");
        const map = ttmap.map({
          key: `${process.env.NEXT_PUBLIC_TOMTOM_API_KEY}`,
          container: initialContainerMap.current,
          language: "ru",
          center: { lat: 55.755819, lng: 37.617644 },
          zoom: 15,
        });

        if (!searchBoxHTML.current || initialContainerMap.current.childNodes) {
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

          initialContainerMap.current.append(searchBoxHTML.current);

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
              const southwest = new ttmap.LngLat(
                item.bbox.lon1,
                item.bbox.lat1
              );
              const northeast = new ttmap.LngLat(
                item.bbox.lon2,
                item.bbox.lat2
              );

              const bounds = new ttmap.LngLatBounds(southwest, northeast);

              map.fitBounds(bounds, {
                padding: 130,
                linear: true,
              });
              drawMarker(item.lon, item.lat, map);
            });
          };

          //@ts-ignore
          ttSearchBox.on("tomtom.searchbox.resultselected", async (e) => {
            const data = await handleSelectPickUpAddress(e.data.text);

            handleResultSelection(
              e,
              searchMarkersManager,
              map,
              handleSelectPickUpAddress
            );
            data && setMarkersByLocationData(data);
          });
          const cityUser = userGeolacation?.features[0]?.properties?.city;
          ttSearchBox.on("tomtom.searchbox.resultscleared", async () => {
            handleResultClearing(
              searchMarkersManager,
              map,
              cityUser ? userGeolacation : "",
              handleSelectPickUpAddress
            );
            dispatch(setChooseOfficeAddress({}));
            removeMapMarkers();
            if (!cityUser) {
              const data = await handleSelectPickUpAddress("Москва");
              data && setMarkersByLocationData(data);
            }

            handleResultClearing(
              searchMarkersManager,
              mapInstance,
              cityUser ? userGeolacation : "",
              handleSelectPickUpAddress
            );
          });
          console.log("choosenPickUpAddress modal ", choosenPickUpAddress);
          //@ts-ignore
          ttSearchBox.on("tomtom.searchbox.resultsfound", (e) => {});
          setIsMapInstance(map);
          if (!!choosenPickUpAddress?.address_line1) {
            const chosenItem = dataOfficesGeoByCity?.filter(
              (item) =>
                item.address_line2 === choosenPickUpAddress.address_line2
            )[0];

            dispatch(setLoadListGeoDataOffice(false));

            if (!chosenItem) return;
            setMarkersByLocationData([chosenItem]);

            map.setCenter([chosenItem.lon, chosenItem.lat]);
            map.zoomTo(10);
            ttSearchBox.setValue(chosenItem.city);

            return;
          }

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

          return map;
        }
      } catch (error) {
        console.log(error);
      }
    },

    [
      choosenPickUpAddress,
      dataOfficesGeoByCity,
      dispatch,
      handleSelectPickUpAddress,
      isStateModal,
      mapInstance,
      userGeolacation,
    ]
  );

  const openMapCourier = useCallback(async () => {
    const map = await loadMap(refMapCourier);
    setTimeout(removeMapMarkers, 0);

    if (!!choosenPickUpAddress?.address_line1) {
      dispatch(setShowCourierAddressData(false));
      return;
    }

    if (dataAddressCourier?.lat) {
      setTimeout(
        () => drawMarker(dataAddressCourier.lon, dataAddressCourier.lat, map),
        0
      );
    }
  }, [
    choosenPickUpAddress?.address_line1,
    dataAddressCourier?.lat,
    dataAddressCourier?.lon,
    dispatch,
    loadMap,
  ]);

  //@ts-ignore
  const drawMarkerByClick = useCallback(
    //@ts-ignore
    async (e) => {
      const result = await unwrapResult(
        await dispatch(getGeolacation({ lat: e.lngLat.lat, lon: e.lngLat.lng }))
      );

      if (result.features) {
        removeMapMarkers();
        drawMarker(e.lngLat.lng, e.lngLat.lat, isMapInstance);
        dispatch(setDataCourier(result?.features[0].properties));
        dispatch(setShowCourierAddressData(true));
      }
    },
    [dispatch, isMapInstance]
  );

  useEffect(() => {
    const openMapPickUp = async () => await loadMap();

    if ((isStateModal && isShouldLoadMap.current) || !isMapInstance) {
      statesTubs.selfDelivery ? openMapPickUp() : openMapCourier();
      console.log("map modal trigger");
      isShouldLoadMap.current = false;
    }
  }, [
    isStateModal,
    loadMap,
    isShouldLoadMap,
    statesTubs.selfDelivery,
    openMapCourier,
    isMapInstance,
  ]);

  useEffect(() => {
    if (isMapInstance?.once) {
      if (statesTubs.selfDelivery) {
        isMapInstance.off("click", drawMarkerByClick);
        return;
      }

      isMapInstance.on("click", drawMarkerByClick);
    }
  }, [
    isMapInstance,
    statesTubs.selfDelivery,
    drawMarkerByClick,
    statesTubs.courierDelivery,
  ]);

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
    closeModal();
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
              {!!showCourierAddressData ? (
                <AddressItemCourier hasButton />
              ) : (
                <p className={style.root__courierDelivery__empty}>
                  <strong>Куда привезти заказ?</strong>
                  <br />
                  <span>
                    Укажите адрес на карте или найдите с помощью поиска
                  </span>
                </p>
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
