import { login } from "@/shared/api/login";
import { loginCheck } from "@/shared/api/loginCheck";
import { oauth } from "@/shared/api/oauth";

import { signup } from "@/shared/api/signup";

import { IAuth, IAuthState, TActiveForm } from "@/shared/config/types/auth";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

//   import { AuthState } from "./types";

export const signInThunk = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }: IAuth) => await login({ email, password })
);

export const signUpThunk = createAsyncThunk(
  "auth/signUp",
  async (data: IAuth) => await signup(data)
);

export const signOauthThunk = createAsyncThunk(
  "auth/signOauth",
  async (data: IAuth) => await oauth(data)
);

export const loginCheckThunk = createAsyncThunk(
  "auth/loginCheck",
  async (token: string) => await loginCheck(token)
);

// export const refreshTokenThunk = createAsyncThunk(
//   "auth/refreshToken",
//   async (token: string) => await refreshTokenApi(token)
// );

const initialState: IAuthState = {
  isOAuth: false,
  isLoading: false,
  activeForm: {},
  loginCheckLoading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<boolean>) => {
      state.isOAuth = action.payload;
    },

    toggleFormIsActive: (state, action: PayloadAction<TActiveForm>) => {
      state.activeForm.isLogin = false;
      state.activeForm.isRegister = false;
      state.activeForm = {
        ...state.activeForm,
        [action.payload.isLogin ? "isLogin" : "isRegister"]: true,
      };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(signInThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signInThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        !action.payload?.warningMessage
          ? (state.isOAuth = true)
          : (state.isOAuth = false);
      })
      .addCase(signUpThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signUpThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.isOAuth = true;
        state.activeForm.isLogin = true;
        state.activeForm.isRegister = false;
      })
      .addCase(signUpThunk.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(signInThunk.rejected, (state) => {
        state.isLoading = false;
        state.isOAuth = false;
      })
      .addCase(signOauthThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOauthThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.isOAuth = true;
      })
      .addCase(signOauthThunk.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(loginCheckThunk.fulfilled, (state) => {
        state.loginCheckLoading = false;
        state.isOAuth = true;
      })
      .addCase(loginCheckThunk.pending, (state) => {
        state.loginCheckLoading = true;
      })
      .addCase(loginCheckThunk.rejected, (state) => {
        state.loginCheckLoading = false;
        state.isOAuth = false;
      });
  },
});
export const selectIsAuth = (state: RootState) => state.auth.isOAuth;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectLoginCheckLoading = (state: RootState) =>
  state.auth.loginCheckLoading;

export const selectActiveForm = (state: RootState) => state.auth.activeForm;

export const { setAuth, toggleFormIsActive } = authSlice.actions;

export default authSlice.reducer;
