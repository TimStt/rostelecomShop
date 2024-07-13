import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBasketGoods, IBasketState } from "@/shared/config/types/goods/types";
import { replaceProductsThunk } from "../basketAuth";
import { deleteProductByLS } from "@/shared/utils/delete-product-by-LS/deleteProductByLS";

const initialState: IBasketState = {
  goods: [],
  loading: false,
  totalPrice: 0,
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addGoodsNoteAuth: (state, action: PayloadAction<IBasketGoods[]>) => {
      state.goods = action.payload;
      // state.totalPrice = action.payload.reduce(
      //   (acc, item) => acc + item.totalPrice,
      //   0
      // );
    },
    removeGoodsNoteAuth: (state, action: PayloadAction<string>) => {
      const newState = deleteProductByLS(action.payload);
      state.goods = newState;
    },
    updateGoodsNoteAuth: (state, action: PayloadAction<IBasketGoods>) => {
      if (!action.payload) return;
      const index = state.goods.findIndex(
        (item) => item._id === action.payload._id
      );
      state.goods[index] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(replaceProductsThunk.fulfilled, (state) => {
      state.goods = [];
    });
  },
});

export const selectBasket = (state: RootState) => state.basket;

export const { addGoodsNoteAuth, removeGoodsNoteAuth, updateGoodsNoteAuth } =
  basketSlice.actions;
export default basketSlice.reducer;
