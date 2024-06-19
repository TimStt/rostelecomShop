import { refreshToken } from "@/shared/api/refreshTokenApi/refreshTokenApi";
import axios, { AxiosRequestConfig } from "axios";

export interface IConfigAxiosAuth extends AxiosRequestConfig {
  needsAuth?: boolean;
}

const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Cache-Control": "no-cache",
  },
});

apiInstance.interceptors.request.use(
  (config) => {
    if ((config as IConfigAxiosAuth).needsAuth) {
      const token = JSON.parse(
        localStorage.getItem("tokens") || "{}"
      ).accessToken;
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !!originalRequest.needsAuth
    ) {
      originalRequest._retry = true;
      const newAccessToken = await refreshToken();
      apiInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${newAccessToken}`;
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return apiInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default apiInstance;
