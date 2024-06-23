import { apiInstance } from "@/shared/config/api/apiinstance";
import { IConfigAxiosAuth } from "@/shared/config/api/apiinstance/ui";

import toast from "react-hot-toast";

export const getProductFavorites = async () => {
  try {
    const { data } = await apiInstance.get(`/api/favorite/all`, {
      needsAuth: true,
    } as IConfigAxiosAuth);

    return data.goods;
  } catch (error) {
    toast.error(`${(error as Error).message}`);
  }
};
