import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  IBasketAdd,
  IProductDeleteOnBd,
  IBasketGoods,
  IProductReplaceAuth,
  IBasketState,
  IBasketUpdateCount,
} from "@/shared/config/types/goods";
import { getProductBasket } from "@/shared/api/getProductBasket";
import { addProductBasketApi } from "@/shared/api/addProductBasketApi";

import { summirizeArray } from "@/shared/utils/summirizeArray";
import { updateCountBasket } from "@/shared/api/updateCountBasket";
// import { handleJwtError } from "@/shared/lib/auth/utils/handleJwtError/error";
import { deleteProductApi } from "@/shared/api/deleteProductApi/deleteProductApi";

import { deleteProductByLS } from "@/shared/utils/delete-product-by-LS/deleteProductByLS";

import { replaceProductsAuth } from "@/shared/api/replace-product-auth";

export const getProductsThunk = createAsyncThunk(
  "basketAuth/getProducts",
  async (jwt: string) => await getProductBasket(jwt)
);

export const addProductsThunk = createAsyncThunk(
  "basketAuth/addProducts",
  async (data: IBasketAdd) => {
    return await addProductBasketApi(data);
  }
);

export const replaceProductsThunk = createAsyncThunk(
  "basketAuth/replaceProducts",
  async ({
    productsReplace,
  }: {
    productsReplace: IProductReplaceAuth["productsReplace"];
  }) => {
    const res = await replaceProductsAuth({
      productsReplace,
      collection: "basket",
    });

    return res?.items;
  }
);

export const deleteProductsThunk = createAsyncThunk(
  "basketAuth/deleteProducts",
  async ({ id, setSpinner }: IProductDeleteOnBd) => {
    const res = await deleteProductApi({ id, setSpinner });

    return res;
  }
);

export const updateCountBasketThunk = createAsyncThunk(
  "basketAuth/updateCountBasket",
  async (data: IBasketUpdateCount) => await updateCountBasket(data)
);

const initialState: IBasketState = {
  goods: [],
  loading: false,
  totalPrice: 0,
};

export const basketAuthSlice = createSlice({
  name: "basketAuth",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getProductsThunk.fulfilled, (state, action) => {
        state.goods = action.payload;
        state.loading = false;
      })
      .addCase(getProductsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductsThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addProductsThunk.fulfilled, (state, action) => {
        state.goods = [
          ...new Map(
            [...state.goods, action.payload as unknown as IBasketGoods].map(
              (item) => [item.clientId, item]
            )
          ).values(),
        ];
        state.loading = false;
      })
      .addCase(addProductsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProductsThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(replaceProductsThunk.fulfilled, (state, action) => {
        if (!action.payload.length) return;
        state.goods = action.payload;

        state.loading = false;
      })
      .addCase(replaceProductsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(replaceProductsThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateCountBasketThunk.fulfilled, (state, action) => {
        // if (!action.payload) return;
        const { id, count } = action.payload;

        const newState = state.goods;

        state.goods = newState.map((item) => {
          if (item._id === id) {
            return {
              ...item,
              count,
            };
          }
          return item;
        });
        // state.totalPrice = (action.payload as { totalPrice: number }[]).reduce(
        //   (acc, cur) => acc + cur.totalPrice,
        //   0
        // );
      })
      .addCase(deleteProductsThunk.fulfilled, (state, action) => {
        if (!action.payload) return;

        const newState = deleteProductByLS(action.payload);
        state.goods = newState;
      });
  },
});
export const selectBasketAuth = (state: RootState) => state.basketAuth;
export const {} = basketAuthSlice.actions;

export default basketAuthSlice.reducer;
