"use client";
import TransitionWrapper from "@/shared/ui/transition-wrapper/ui";
import { TitleBlock } from "../title-block";
import style from "./delivery-order.module.scss";
import { motion } from "framer-motion";

import {
  MutableRefObject,
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { setItemLocalStorage } from "@/shared/utils/setItemLocalStorage";
import { useGetStateOnLocalStorage } from "@/shared/utils/useGetStateOnLocalStorage";
import { useDispatch, useSelector } from "react-redux";
import { IStatesDeliveryTub } from "@/shared/config/types/ui";
import {
  selectChooseOfficeAddress,
  selectIsChooseCourierAddress,
  selectIsStatesDeliveryTub,
  selectShowCourierAddress,
  selectShowCourierAddressData,
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
import { AddressItemCourier } from "../adress-item-courier";

const DeliveryOrder = forwardRef((ref) => {
  const dispatch = useDispatch<AppDispatch>();
  const statesTubs = useSelector(selectIsStatesDeliveryTub);
  const { userGeolacation } = useSelector(selectUser);
  const refMap = useRef(null) as unknown as MutableRefObject<HTMLDivElement>;
  const chooseAddressCourier = useSelector(selectIsChooseCourierAddress);
  const refSpan = useRef() as MutableRefObject<HTMLSpanElement>;
  const handleSelectPickUpAddress = useHandleSelectPickUpAddress();
  const choosenPickUpAddress = useSelector(selectChooseOfficeAddress);
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const { handleUpdateMap } = useUpdateMap();
  const showCourierAddress = useSelector(selectShowCourierAddress);
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
        handleLoadMap({
          searchVelue: choosenPickUpAddress.city,
          initialPosition: {
            lat: choosenPickUpAddress.lat as number,
            lng: choosenPickUpAddress.lon as number,
          },
          marker: true,
        });
        console.log("choosenPickUpAddress tab ", choosenPickUpAddress);
        return;
      }
      if (!!userGeolacation?.features[0].properties?.city?.length) {
        await handleLoadMap({
          searchVelue: userGeolacation.features[0].properties.city,
        });
        return;
      }
      console.log("trigger toggletabClick ", activeTab);
      await handleLoadMap({});
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
      // if (!refMap.current) return;
      try {
        const ttmaps = await import("@tomtom-international/web-sdk-maps");
        initSearchMarker(ttmaps);
        const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY;
        // refMap.current.innerHTML = "";
        console.log(" load map trigger ", choosenPickUpAddress);
        const map = ttmaps.map({
          key: `${apiKey}`,
          container: refMap.current,
          language: "ru",
          center: initialPosition,
          zoom: 10,
        });
        setIsLoadingMap(false);

        if (searchBoxHTML.current) searchBoxHTML.current.innerHTML = "";

        //@ts-ignore
        const cityUser = userGeolacation?.features[0]?.properties?.city;

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
        ttSearchBox.on("tomtom.searchbox.resultscleared", async () => {
          handleResultClearing(
            searchMarkersManager,
            map,
            initialPosition,
            handleSelectPickUpAddress
          );
          dispatch(setChooseOfficeAddress({}));

          map.setCenter(initialPosition).zoomTo(10);
        });

        ttSearchBox.setValue(
          cityUser || choosenPickUpAddress?.city || "Москва"
        );

        if (choosenPickUpAddress?.address_line1) {
          console.log("тиггер карта от окна");
          await handleUpdateMap({
            position: {
              lat: choosenPickUpAddress?.lat as number,
              lon: choosenPickUpAddress?.lon as number,
            },
            box: choosenPickUpAddress?.bbox as IBbox,
            initialMapInstance: map,
          });
          ttSearchBox.setValue(choosenPickUpAddress.city);
        }

        dispatch(setMapOrder(map));

        if (!marker && !!cityUser) {
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
        if (!marker && !cityUser && !choosenPickUpAddress) {
          await handleSelectPickUpAddress("Москва");
          return;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [choosenPickUpAddress]
  );

  console.log("choosenPickUpAddress", choosenPickUpAddress);

  useEffect(() => {
    if ((!!isLoadingMap && refMap.current !== null) || !!choosenPickUpAddress) {
      console.log("map page trigger");
      handleLoadMap({});
    }
  }, [
    choosenPickUpAddress,
    handleLoadMap,
    isLoadingMap,
    statesTubs.selfDelivery,
  ]);

  useEffect(() => {
    getNavigateGeoByUser();
  }, [getNavigateGeoByUser, statesTubs.selfDelivery]);

  console.log("statesTubs.courierDelivery", statesTubs.courierDelivery);

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
            {showCourierAddress && chooseAddressCourier?.address_line1 ? (
              <>
                <span>Доставка будет осуществлена по этому адресу: </span>
                <AddressItemCourier hasButton={false} />
              </>
            ) : (
              <>
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
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
});

DeliveryOrder.displayName = "DeliveryOrder";

export default DeliveryOrder;
