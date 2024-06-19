import { apiInstance } from "@/shared/config/api/apiinstance";
import { IConfigAxiosAuth } from "@/shared/config/api/apiinstance/ui";

import toast from "react-hot-toast";

export const getProductBasket = async (jwt: string) => {
  try {
    const { data } = await apiInstance.get(`/api/basket/all`, {
      needsAuth: true,
    } as IConfigAxiosAuth);

    // if (data?.error) {
    //   const newData = (await handleJwtError({
    //     errorName: data.error.name,
    //     repeatRequestAfterRefreshData: { functionName: "getProductBasket" },
    //   })) as unknown as IBasketGoods[];
    //   return newData;
    // }

    return data.goods;
  } catch (error) {
    toast.error(`${(error as Error).message}`);
  }
};
