import { apiInstance } from "@/shared/config/api/apiinstance";
import { IConfigAxiosAuth } from "@/shared/config/api/apiinstance/ui";

import toast from "react-hot-toast";

export const getProductBasket = async (jwt: string) => {
  try {
    const { data } = await apiInstance.get(`/api/basket/all`, {
      needsAuth: true,
    } as IConfigAxiosAuth);

    return data.goods;
  } catch (error) {
    toast.error(`${(error as Error).message}`);
  }
};
