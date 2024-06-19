import { apiInstance } from "@/shared/config/api/apiinstance";
import { IConfigAxiosAuth } from "@/shared/config/api/apiinstance/ui";
import {
  IBasketAdd,
  IBasketGoods,
  IBasketReplace,
} from "@/shared/config/types/goods";
// import { handleJwtError } from "@/shared/lib/auth/utils/handleJwtError/error";
import toast from "react-hot-toast";

export const replaceProductBasket = async ({
  jwt,
  basketProduct,
}: IBasketReplace) => {
  try {
    const { data } = await apiInstance.post(
      "/api/basket/replace-goods",
      {
        items: basketProduct,
      },
      {
        needsAuth: true,
      } as IConfigAxiosAuth
    );

    // if (data.error) {
    //   logger.info("replaceProductBasket  error trigger", data);
    //   const res = await handleJwtError({
    //     errorName: data.error.name,
    //     repeatRequestAfterRefreshData: {
    //       functionName: "replaceProductBasket",
    //       payload: { items: basketProduct },
    //     },
    //   });
    //   return res;
    // }

    return { jwt, items: data };
  } catch (error) {
    toast.error(`${(error as Error).message}`);
  }
};
