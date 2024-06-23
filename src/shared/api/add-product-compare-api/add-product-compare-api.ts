import { apiInstance } from "@/shared/config/api/apiinstance";
import { IConfigAxiosAuth } from "@/shared/config/api/apiinstance/ui";
import {
  IBasketAdd,
  IBasketGoods,
  ICompareAdd,
  IGoods,
} from "@/shared/config/types/goods";
// import { handleJwtError } from "@/shared/lib/auth/utils/handleJwtError/error";
import toast from "react-hot-toast";

export const addProductToCompareApi = async ({
  setSpinner,
  ...otherFields
}: ICompareAdd) => {
  try {
    setSpinner(true);
    const { data } = await apiInstance.post(
      "/api/compare/add",
      {
        product: {
          category: otherFields.category,
          productId: otherFields.productId,
          sizes: otherFields.sizes,

          clientId: otherFields.clientId,
        },
      },
      {
        needsAuth: true,
      } as IConfigAxiosAuth
    );
    toast.success(`${(data as IGoods).name} добавлен в сравнение`);
    return data;
  } catch (error) {
    toast.error(`${(error as Error).message}`);
  } finally {
    setSpinner(false);
  }
};
