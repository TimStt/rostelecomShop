import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  IBasketAdd,
  IFavoritesGoods,
  IFavoritesState,
  IProductDeleteOnBd,
  IProductReplaceAuth,
} from "@/shared/config/types/goods";
import { getProductBasket } from "@/shared/api/getProductBasket";
import { addProductToFavoritesApi } from "@/shared/api/add-favorite-api";
import { getProductFavorites } from "@/shared/api/get-product-favorites";
import { deleteProductFavoritesApi } from "@/shared/api/delete-product-favorite-api/delete-product-favorite-api";
import { deleteProductByLS } from "@/shared/utils/deleteProductByLS/deleteProductByLS";

import { deleteAllProductByLS } from "@/shared/utils/delete-all-product-by-LS";
import { deleteAllProductApi } from "@/shared/api/delete-all-product-by-collection-api";
import { replaceProductsAuth } from "@/shared/api/replace-product-auth";

export const getProductsFavoritesThunk = createAsyncThunk(
  "favorites/getProducts",
  async () => await getProductFavorites()
);

export const addProductsFavoritesThunk = createAsyncThunk(
  "favorites/addProducts",
  async (data: IBasketAdd) => await addProductToFavoritesApi(data)
);

export const removeProductsFavoritesThunk = createAsyncThunk(
  "favorites/removeProducts",
  async (data: IProductDeleteOnBd) => {
    return await deleteProductFavoritesApi(data);
  }
);

export const deleteAllProductsFavoritesThunk = createAsyncThunk(
  "favorites/deleteAllProducts",
  async () => {
    return await deleteAllProductApi({ collection: "favorite" });
  }
);

export const replaceProductsFavoritesThunk = createAsyncThunk(
  "favorites/replaceProductsFavorites",
  async ({
    productsReplace,
  }: {
    productsReplace: IProductReplaceAuth["productsReplace"];
  }) => {
    const res = await replaceProductsAuth({
      productsReplace,
      collection: "favorite",
    });

    return res?.items;
  }
);

const initialState: IFavoritesState = {
  goods: [],
  loading: false,
  isEmpty: true,
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addGoodstoFavorites: (state, action: PayloadAction<IFavoritesGoods[]>) => {
      state.goods = action.payload;
    },

    setIsEmptyFavorites: (state, action: PayloadAction<boolean>) => {
      state.isEmpty = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getProductsFavoritesThunk.fulfilled, (state, action) => {
        state.goods = action.payload;
        state.loading = false;
      })
      .addCase(getProductsFavoritesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductsFavoritesThunk.rejected, (state) => {
        state.loading = false;
      })

      .addCase(removeProductsFavoritesThunk.fulfilled, (state, action) => {
        if (!action.payload) return;
        const newState = deleteProductByLS(action.payload, "favorites");
        state.goods = newState;

        if (!newState.length) state.isEmpty = true;
      })
      .addCase(deleteAllProductsFavoritesThunk.fulfilled, (state) => {
        state.goods = [];
        state.isEmpty = true;
        state.loading = false;

        const res = deleteAllProductByLS("favorites");
      })
      .addCase(deleteAllProductsFavoritesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAllProductsFavoritesThunk.rejected, (state) => {
        state.loading = false;
      })

      .addCase(replaceProductsFavoritesThunk.fulfilled, (state, action) => {
        if (!action.payload?.length) return;
        state.goods = action.payload;

        state.loading = false;
      })
      .addCase(replaceProductsFavoritesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(replaceProductsFavoritesThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});
export const selectFavorites = (state: RootState) => state.favorites.goods;
export const selectLoadingFavorites = (state: RootState) =>
  state.favorites.loading;

export const selectIsEmptyFavorites = (state: RootState) =>
  state.favorites.isEmpty;
export const { addGoodstoFavorites, setIsEmptyFavorites } =
  favoritesSlice.actions;

export default favoritesSlice.reducer;
