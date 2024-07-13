import { IGoods, IStateViewSlice } from "@/shared/config/types/goods";
import { setItemLocalStorage } from "@/shared/utils/setItemLocalStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IStateViewSlice = {
  goods: [],
};

export const viewGoodsSlice = createSlice({
  name: "ViewGoods",
  initialState,
  reducers: {
    addViewProduct(state, action: PayloadAction<IGoods>) {
      state.goods = [...state.goods, action.payload];
      setItemLocalStorage("viewGoods", state.goods);
    },
    setViewProduct(state, action: PayloadAction<IGoods[]>) {
      state.goods = action.payload;
    },
  },
});

export const selectViewProducts = (state: RootState) => state.viewGoods;

export const { addViewProduct, setViewProduct } = viewGoodsSlice.actions;
export default viewGoodsSlice.reducer;
