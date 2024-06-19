"use client";
import TransitionWrapper from "@/shared/ui/transition-wrapper/ui";
import { TitleBlock } from "../title-block";
import style from "./delivery-order.module.scss";
import { motion } from "framer-motion";

import {
  MutableRefObject,
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { setItemLocalStorage } from "@/shared/utils/setItemLocalStorage";
import { useGetStateOnLocalStorage } from "@/shared/utils/useGetStateOnLocalStorage";
import { useDispatch, useSelector } from "react-redux";
import { IStatesDeliveryTub } from "@/shared/config/types/ui";
import {
  selectChooseOfficeAddress,
  selectIsStatesDeliveryTub,
  setChooseOfficeAddress,
  setIsMapModalOpen,
  setMapOrder,
  setStateTabs,
  toggleStateTabs,
} from "@/shared/stores/order";
import cls from "classnames";
import { Input } from "@/shared/ui/input";
import { TabsButtons } from "../tabs-buttons";
import { Button } from "@/shared/ui";
import { motionSettingsVisibleNoScaleDisplay } from "@/shared/ui/ModalMotion/motion-settings";
import { getUserGeolacation, selectUser } from "@/shared/stores/user";
import toast from "react-hot-toast";
import { addScriptToHead } from "@/shared/utils/add-script-to-head";
import {
  handleResultClearing,
  handleResultSelection,
  handleResultsFound,
  initSearchMarker,
  SearchMarkersManager,
  useHandleSelectPickUpAddress,
} from "@/shared/utils/map";
import { AddressList } from "../address-list";
import { useUpdateMap } from "@/features/order-logic/use-update-map";
import { IBbox, IHandleLoadMap } from "@/shared/config/types/geo";
import { tr } from "@faker-js/faker";
import { mapOption } from "@/shared/config/constants/map-option";

const DeliveryOrder = () => {
  const dispatch = useDispatch<AppDispatch>();
  const statesTubs = useSelector(selectIsStatesDeliveryTub);
  const { userGeolacation } = useSelector(selectUser);
  const refMap = useRef() as MutableRefObject<HTMLDivElement>;

  const refSpan = useRef() as MutableRefObject<HTMLSpanElement>;
  const handleSelectPickUpAddress = useHandleSelectPickUpAddress();
  const choosenPickUpAddress = useSelector(selectChooseOfficeAddress);
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const { handleUpdateMap } = useUpdateMap();
  const searchBoxHTML = useRef() as MutableRefObject<HTMLDivElement>;
  const toggletabClick = async (activeTab: "tabOne" | "tabTwo") => {
    dispatch(
      toggleStateTabs({
        state: "statesDeliveryTub",
        key: activeTab === "tabOne" ? "selfDelivery" : "courierDelivery",
      })
    );
    if (activeTab === "tabOne") {
      if (choosenPickUpAddress?.address_line1) {
        await handleLoadMap({
          searchVelue: choosenPickUpAddress.city,
          initialPosition: {
            lat: choosenPickUpAddress.lat as number,
            lng: choosenPickUpAddress.lon as number,
          },
          marker: true,
        });
        console.log("choosenPickUpAddress trigger ", activeTab);
        return;
      }
      if (!!userGeolacation?.features[0].properties?.city?.length) {
        handleLoadMap({
          searchVelue: userGeolacation.features[0].properties.city,
        });
        return;
      }
      handleLoadMap({});
      return;
    }
  };

  const seccessUserGeo = useCallback(
    async (pos: GeolocationPosition) => {
      const { latitude, longitude } = pos.coords;
      await dispatch(getUserGeolacation({ lat: latitude, lon: longitude }));

      setIsLoadingMap(true);
    },
    [dispatch, setIsLoadingMap]
  );
  const errorViewGeoUser = (error: GeolocationPositionError) => {
    toast.error(error.message);
  };

  const getNavigateGeoByUser = useCallback(async () => {
    navigator.geolocation.getCurrentPosition(seccessUserGeo, errorViewGeoUser);
  }, [seccessUserGeo]);

  const handleLoadMap = useCallback(
    async ({
      searchVelue = "",
      initialPosition = { lat: 55.755819, lng: 37.617644 },
      marker,
    }: IHandleLoadMap) => {
      const ttmaps = await import("@tomtom-international/web-sdk-maps");
      initSearchMarker(ttmaps);
      const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY;
      console.log("choosenPickUpAddress", choosenPickUpAddress);
      const map = ttmaps.map({
        key: `${apiKey}`,
        container: refMap.current,
        language: "ru",
        center: initialPosition,
        // zoom: 15,
      });
      console.log("marker", marker);
      choosenPickUpAddress?.address_line1 &&
        (await handleUpdateMap({
          position: {
            lat: choosenPickUpAddress?.lat as number,
            lon: choosenPickUpAddress?.lon as number,
          },
          box: choosenPickUpAddress?.bbox as IBbox,
          initialMapInstance: map,
        }));

      console.log(refSpan.current.nextElementSibling);

      //@ts-ignore

      if (
        !searchBoxHTML.current ||
        refSpan.current.nextElementSibling !== searchBoxHTML.current
      ) {
        //@ts-ignore
        const ttSearchBox = new tt.plugins.SearchBox(
          //@ts-ignore
          tt.services,
          mapOption
        );
        !!searchVelue.length && ttSearchBox.setValue(searchVelue);
        !marker &&
          !!userGeolacation?.features[0].properties.city?.length &&
          ttSearchBox.setValue(userGeolacation.features[0].properties.city);

        searchBoxHTML.current = ttSearchBox.getSearchBoxHTML();
        searchBoxHTML.current.classList.add("selfDelivery__search-input");

        refSpan.current.after(searchBoxHTML.current);
        //@ts-ignore
        const searchMarkersManager = new SearchMarkersManager(map);
        //@ts-ignore
        ttSearchBox.on("tomtom.searchbox.resultsfound", (e) =>
          handleResultsFound(e, searchMarkersManager, map)
        );
        //@ts-ignore
        ttSearchBox.on("tomtom.searchbox.resultselected", (e) =>
          handleResultSelection(
            e,
            searchMarkersManager,
            map,
            handleSelectPickUpAddress
          )
        );
        ttSearchBox.on("tomtom.searchbox.resultscleared", () => {
          handleResultClearing(
            searchMarkersManager,
            map,
            userGeolacation,
            handleSelectPickUpAddress
          );
          dispatch(setChooseOfficeAddress({}));
        });
      }

      dispatch(setMapOrder(map));

      if (!marker && !!userGeolacation?.features) {
        await handleSelectPickUpAddress(
          userGeolacation.features[0].properties.city
        );
        map
          .setCenter([
            userGeolacation.features[0].properties.lon,
            userGeolacation.features[0].properties.lat,
          ])
          .zoomTo(10);
        dispatch(setMapOrder(map));
        return;
      }
    },
    [dispatch, handleSelectPickUpAddress, userGeolacation]
  );

  useEffect(() => {
    addScriptToHead(
      "https://api.tomtom.com/maps-sdk-for-web/cdn/plugins/SearchBox/3.1.3-public-preview.0/SearchBox-web.js"
    );
    addScriptToHead(
      "https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.1.2-public-preview.15/services/services-web.min.js"
    );

    if (!!isLoadingMap && !refMap.current?.firstChild) {
      handleLoadMap({});
      setIsLoadingMap(false);
    }
  }, [handleLoadMap, isLoadingMap]);

  useEffect(() => {
    getNavigateGeoByUser();
  }, []);

  return (
    <div className={style.root}>
      <TitleBlock classname={style.roor__title} number={2} title="Доставка" />
      <div className={style.root__inner}>
        <TabsButtons
          classname={style.root__tabs}
          textOne="Самовывоз (Бесплатно)"
          textTwo="Доставка курьером"
          onClick={toggletabClick}
          stateTubOne={statesTubs.selfDelivery}
          stateTubTwo={statesTubs.courierDelivery}
        />

        {statesTubs.selfDelivery ? (
          <motion.div
            className={style.root__selfDelivery}
            {...motionSettingsVisibleNoScaleDisplay("selfDelivery")}
          >
            <div className={style.root__selfDelivery__searching}>
              <span className={style.root__selfDelivery__text} ref={refSpan}>
                Введите адрес или выберите офис на карте
              </span>
              <AddressList />
            </div>

            <div
              className={style.root__selfDelivery__map}
              ref={refMap}
              onClick={() => dispatch(setIsMapModalOpen(true))}
            />
          </motion.div>
        ) : (
          <motion.div
            className={style.root__courierDelivery}
            {...motionSettingsVisibleNoScaleDisplay("courierDelivery")}
          >
            <span>
              <strong>Куда привезти заказ?</strong>
            </span>
            <span>Укажите адрес доставки на карте</span>
            <Button
              size="small"
              onClick={() => dispatch(setIsMapModalOpen(true))}
            >
              Карта
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DeliveryOrder;
