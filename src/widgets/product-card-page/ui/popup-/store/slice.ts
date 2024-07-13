import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGoods } from "@/shared/config/types/goods";

import { selectCurrentProductState } from "@/shared/stores/current-product-add-busket";
import { productInList } from "@/shared/utils/productInList";
import { useGetStateOnLocalStorage } from "@/shared/utils/use-get-state-LS/useGetStateOnLocalStorage";

interface IoPopupShareSlice {
  isOpen: boolean;
}

export const initialState: IoPopupShareSlice = {
  isOpen: false,
};

export const popupShareSlice = createSlice({
  name: "popupShare",
  initialState,
  reducers: {
    toggleStatePopupShare: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});
export const selectPopupShareState = (state: RootState) =>
  state.popupShare.isOpen;
export const { toggleStatePopupShare } = popupShareSlice.actions;
export default popupShareSlice.reducer;
