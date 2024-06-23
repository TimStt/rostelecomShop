import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGoods } from "@/shared/config/types/goods";
import { HYDRATE } from "next-redux-wrapper";

export interface ICurrentProductAddBusketState {
  product: IGoods | null;
}

const initialState: ICurrentProductAddBusketState = {
  product: null,
};

export const currentProductAddBusketSlice = createSlice({
  name: "currentProductAddBusket",
  initialState,
  reducers: {
    setCurrentProduct: (state, action: PayloadAction<IGoods>) => {
      state.product = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase<typeof HYDRATE, PayloadAction<RootState, typeof HYDRATE>>(
      HYDRATE,
      (state, { payload }) => {
        if (payload.currentProductAddBusket) {
          state.product = payload.currentProductAddBusket.product;
        }
      }
    );
  },
});

export const { setCurrentProduct } = currentProductAddBusketSlice.actions;

export const selectCurrentProductState = (state: RootState) =>
  state.currentProductAddBusket.product;

export default currentProductAddBusketSlice.reducer;
