import React, { useLayoutEffect } from "react";

export const useGetStateOnLocalStorage = <T>(
  key: string,
  isAuth?: boolean,
  handler?: (value: T) => void
) => {
  useLayoutEffect(() => {
    if (isAuth) return;
    if (!localStorage.getItem(key)) return;
    const value = JSON.parse(localStorage.getItem(key) as string);
    if (handler) {
      handler(value);
      return;
    }
  }, [handler, isAuth, key]);
};
