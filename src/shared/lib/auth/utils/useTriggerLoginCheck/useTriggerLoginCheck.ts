import { useDispatch } from "react-redux";
import { useUserAuth } from "../isUserAuth";
import { loginCheckThunk } from "@/shared/stores/auth";
import App from "next/app";
import { useEffect } from "react";

export const useTriggerLoginCheck = () => {
  const dispatch = useDispatch<AppDispatch>();

  const isAuth = useUserAuth();
  const token = JSON.parse(
    localStorage.getItem("tokens") as string
  )?.accessToken;

  console.log("useTriggerLoginCheck", isAuth);
  console.log("token useTriggerLoginCheck", token);

  useEffect(() => {
    if (!isAuth || !token) return;

    dispatch(loginCheckThunk(token));
  }, [isAuth, dispatch, token]);
};
