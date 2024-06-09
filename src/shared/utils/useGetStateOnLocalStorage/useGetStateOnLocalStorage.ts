import React, { useLayoutEffect } from "react";

export const useGetStateOnLocalStorage = <T>(
  key: string,
  handler?: (value: T) => void
) => {
  useLayoutEffect(() => {
    if (!localStorage.getItem(key)) return;
    const value = JSON.parse(localStorage.getItem(key) as string);
    if (handler) {
      handler(value);
      return;
    }
  }, [handler, key]);
};
