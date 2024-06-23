import { apiInstance } from "@/shared/config/api/apiinstance";
import { IConfigAxiosAuth } from "@/shared/config/api/apiinstance/ui";
import {
  IBasketAdd,
  IBasketGoods,
  IProductReplaceAuth,
} from "@/shared/config/types/goods";
// import { handleJwtError } from "@/shared/lib/auth/utils/handleJwtError/error";
import toast from "react-hot-toast";

export const replaceProductsAuth = async ({
  productsReplace,
  collection,
}: IProductReplaceAuth) => {
  try {
    const { data } = await apiInstance.post(
      `/api/${collection}/replace-goods`,
      {
        items: productsReplace,
      },
      {
        needsAuth: true,
      } as IConfigAxiosAuth
    );

    return { items: data };
  } catch (error) {
    toast.error(`${(error as Error).message}`);
  }
};
