import { apiInstance } from "@/shared/config/api/apiinstance";
import { IAuth } from "@/shared/config/types/auth";

import { onAuthSuccess } from "@/shared/lib/auth/utils/on-auth-success";
import toast from "react-hot-toast";

export const login = async ({ email, password, isOAuth = false }: IAuth) => {
  try {
    const PATH_ROUTE = "api/user/login";
    const { data } = await apiInstance.post(PATH_ROUTE, {
      email,
      password,
    });

    if (data.warningMessage) {
      toast.error(data.warningMessage);
      return data;
    }

    onAuthSuccess("Вы успешно авторизовались!", data.tokens);

    return data;
  } catch (error: any) {
    console.error("login error: ", error);
    return;
  }
};
