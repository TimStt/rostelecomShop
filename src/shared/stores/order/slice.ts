import { getRostelecomOfficeByCity } from "@/shared/api/get-rostelecom-office-by-city";
import {
  IGetRostelecomOfficeByCity,
  IRostelecomOfficeByCityData,
} from "@/shared/config/types/geo";
import {
  IStateOrderSlice,
  IStatesDeliveryTub,
  IStatesTabPayment,
  IStatesTypePayment,
  typeOfKeyNotGeo,
} from "@/shared/config/types/ui";
import { setItemLocalStorage } from "@/shared/utils/setItemLocalStorage";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getStorage from "redux-persist/es/storage/getStorage";

export const getOfficeByCity = createAsyncThunk(
  "order/getOfficeByCity",
  async ({ city, lang }: IGetRostelecomOfficeByCity) =>
    await getRostelecomOfficeByCity({ city, lang })
);

const initialState: IStateOrderSlice = {
  statesDeliveryTub: {
    selfDelivery: true,
    courierDelivery: false,
  },
  statesTabPayment: {
    online: true,
    cash: false,
  },
  statesTypePayment: {
    cards: true,
    spb: false,
    sberPay: false,
    cashOnOffice: false,
    cardOnOffice: false,
  },
  officeGeoData: null,
  map: null,
  loadListGeoDataOffice: false,
  chooseOfficeAddress: null,
  chooseAddressCourier: null,
  loadingOfficeGeoData: false,
  isMapModalOpen: false,
  showCourierAddressData: false,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    toggleStateTabs: (
      state,
      action: PayloadAction<{
        state: typeOfKeyNotGeo;

        key:
          | keyof IStatesTypePayment
          | keyof IStatesDeliveryTub
          | keyof IStatesTabPayment;
      }>
    ) => {
      const newState = Object.entries(state[action.payload.state]).reduce(
        (prev, [key, value]) =>
          key === action.payload.key
            ? { ...prev, [key]: !value }
            : { ...prev, [key]: false },
        {}
      );
      state[action.payload.state] = newState;
    },
    setStateTabs: (
      state,
      action: PayloadAction<{
        state: typeOfKeyNotGeo;
        value: IStatesTypePayment | IStatesDeliveryTub | IStatesTabPayment;
      }>
    ) => {
      state[action.payload.state] = action.payload.value;
    },
    setMapOrder: (state, action: PayloadAction<any>) => {
      state.map = action.payload;
    },
    setLoadListGeoDataOffice: (state, action: PayloadAction<boolean>) => {
      state.loadListGeoDataOffice = action.payload;
    },
    setChooseOfficeAddress: (
      state,
      action: PayloadAction<Partial<IRostelecomOfficeByCityData>>
    ) => {
      state.chooseOfficeAddress = action.payload;
    },

    setChooseAddressCourier: (
      state,
      action: PayloadAction<Partial<IRostelecomOfficeByCityData>>
    ) => {
      state.chooseAddressCourier = action.payload;
    },

    setIsMapModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isMapModalOpen = action.payload;
    },

    setShowCourierAddressData: (state, action: PayloadAction<boolean>) => {
      state.showCourierAddressData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOfficeByCity.fulfilled, (state, action) => {
        if (action.payload) state.officeGeoData = action.payload;
        state.loadingOfficeGeoData = false;
      })
      .addCase(getOfficeByCity.rejected, (state) => {
        state.officeGeoData = null;
        state.loadingOfficeGeoData = false;
      })
      .addCase(getOfficeByCity.pending, (state) => {
        state.loadingOfficeGeoData = true;
      });
  },
});
export const selectIsLoadListGeoDataOffice = (state: RootState) =>
  state.order.loadListGeoDataOffice;
export const selectIsChooseCourierAddress = (state: RootState) =>
  state.order.chooseAddressCourier;

export const selectIsStatesDeliveryTub = (state: RootState) =>
  state.order.statesDeliveryTub;
export const selectIsLoadingOfficeGeoData = (state: RootState) =>
  state.order.loadingOfficeGeoData;

export const selectIsStatesTypePayment = (state: RootState) =>
  state.order.statesTypePayment;

export const selectIsStatesTabPayment = (state: RootState) =>
  state.order.statesTabPayment;
export const selectOfficeGeoData = (state: RootState) =>
  state.order.officeGeoData;

export const selectOpenMapModal = (state: RootState) =>
  state.order.isMapModalOpen;
export const selectShowCourierAddressData = (state: RootState) =>
  state.order.showCourierAddressData;

export const selectMapOrder = (state: RootState) => state.order.map;
export const selectChooseOfficeAddress = (state: RootState) =>
  state.order.chooseOfficeAddress;

export const {
  toggleStateTabs,
  setStateTabs,
  setMapOrder,
  setLoadListGeoDataOffice,
  setChooseOfficeAddress,
  setChooseAddressCourier,
  setIsMapModalOpen,
  setShowCourierAddressData,
} = orderSlice.actions;
export default orderSlice.reducer;
