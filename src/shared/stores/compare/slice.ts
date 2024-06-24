import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  ICompareAdd,
  ICompareData,
  ICompareState,
  IGoods,
  IProductDeleteOnBd,
  IProductReplaceAuth,
} from "@/shared/config/types/goods";
import { getProductBasket } from "@/shared/api/getProductBasket";
import { deleteAllProductApi } from "@/shared/api/delete-all-product-by-collection-api";
import { deleteProductApi } from "@/shared/api/deleteProductApi/deleteProductApi";
import { deleteProductCompareApi } from "@/shared/api/delete-product-compare-api/delete-product-compare-api";
import { deleteProductByLS } from "@/shared/utils/deleteProductByLS/deleteProductByLS";
import { replaceProductsAuth } from "@/shared/api/replace-product-auth";
import { addProductToCompareApi } from "@/shared/api/add-product-compare-api";
import { addProductByLS } from "@/shared/utils/add-product-by-LS";
import { getProductCompare } from "@/shared/api/get-product-compare";
import { deleteAllProductByLS } from "@/shared/utils/delete-all-product-by-LS";

export const deleteOneProductCompareThunk = createAsyncThunk(
  "compare/deleteOneProduct",
  async ({ id, setSpinner }: IProductDeleteOnBd) => {
    return await deleteProductCompareApi({ id, setSpinner });
  }
);

export const replaceProductsCompareThunk = createAsyncThunk(
  "compare/replaceProductsCompare",
  async ({
    productsReplace,
  }: {
    productsReplace: IProductReplaceAuth["productsReplace"];
  }) => {
    const res = await replaceProductsAuth({
      productsReplace,
      collection: compareSlice.name,
    });

    return res?.items;
  }
);
export const addProductsCompareThunk = createAsyncThunk(
  "compare/addProducts",
  async (data: ICompareAdd) => await addProductToCompareApi(data)
);

export const getProductsCompareThunk = createAsyncThunk(
  "compare/getAllProducts",
  async (category?: string) => await getProductCompare(category)
);
export const deleteAllProductsCompareThunk = createAsyncThunk(
  "compare/deleteAllProducts",
  async () => {
    return await deleteAllProductApi({ collection: compareSlice.name });
  }
);

const initialState: ICompareState = {
  goods: null,
  loading: false,
  isEmpty: true,
};

export const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    setCompareProducts: (state, action: PayloadAction<ICompareData[]>) => {
      state.goods = action.payload;
    },
    setIsEmptyCompare: (state, action: PayloadAction<boolean>) => {
      state.isEmpty = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(deleteAllProductsCompareThunk.fulfilled, (state) => {
        state.goods = null;
        state.isEmpty = true;
        state.loading = false;
        deleteAllProductByLS("compare");
      })
      .addCase(deleteAllProductsCompareThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAllProductsCompareThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getProductsCompareThunk.fulfilled, (state, action) => {
        state.goods = action.payload;
        state.loading = false;
      })
      .addCase(getProductsCompareThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductsCompareThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteOneProductCompareThunk.fulfilled, (state, action) => {
        if (!action.payload) return;
        const newState = deleteProductByLS(action.payload, "compare");
        state.goods = newState;
        state.loading = false;
        if (!newState.length) state.isEmpty = true;
      })
      .addCase(deleteOneProductCompareThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProductsCompareThunk.fulfilled, (state, action) => {
        if (!action.payload) return;
        const newState = addProductByLS(action.payload, "compare");
        state.goods = newState;
      });
  },
});
export const selectCompareGoods = (state: RootState) => state.compare.goods;
export const selectLoadingCompare = (state: RootState) => state.compare.loading;
export const selectIsEmptyCompare = (state: RootState) => state.compare.isEmpty;
export const { setCompareProducts, setIsEmptyCompare } = compareSlice.actions;

export default compareSlice.reducer;
