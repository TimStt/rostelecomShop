import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Selector,
} from "@reduxjs/toolkit";
import { IUser } from "@/shared/config/types/user/types";
import { loginCheckThunk } from "../auth/slice";
import {
  IGetGeolocationUser,
  IUserGeolacation,
} from "@/shared/config/types/geo";
import { getGeolacationApi } from "@/shared/api/get-geolacation-user-api";

export const getUserGeolacation = createAsyncThunk(
  "user/getUserGeolacation",
  async ({ lat, lon }: IGetGeolocationUser) =>
    await getGeolacationApi({ lat, lon })
);

interface IRootState {
  user: IUser | null;
  userGeolacation: IUserGeolacation | null;
}

const initialState: IRootState = {
  user: null,
  userGeolacation: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(loginCheckThunk.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(getUserGeolacation.fulfilled, (state, action) => {
      if (!action.payload) return;
      state.userGeolacation = action.payload;
    });
  },
});
export const selectUser = (state: RootState) => state.user;

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
