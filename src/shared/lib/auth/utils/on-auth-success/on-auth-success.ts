import { IResponseData } from "@/shared/config/types/auth";
import toast from "react-hot-toast";

export const onAuthSuccess = (
  message: string,
  data: {
    accessToken: string;
    refreshToken: string;
  }
) => {
  console.log("create tokens", data);
  localStorage.setItem("tokens", JSON.stringify(data));

  toast.success(message);
};
