import { apiInstance } from "@/shared/config/api/apiinstance";
import { IConfigAxiosAuth } from "@/shared/config/api/apiinstance/ui";
import { IBasketAdd, IBasketGoods } from "@/shared/config/types/goods";
// import { handleJwtError } from "@/shared/lib/auth/utils/handleJwtError/error";
import toast from "react-hot-toast";

export const addProductToFavoritesApi = async ({
  setSpinner,
  ...otherFields
}: IBasketAdd) => {
  try {
    setSpinner(true);
    const { data } = await apiInstance.post(
      "/api/favorites/add",
      {
        product: {
          category: otherFields.category,
          productId: otherFields.productId,
          sizes: otherFields.sizes,
          count: otherFields.count,
          clientId: otherFields.clientId,
        },
      },
      {
        needsAuth: true,
      } as IConfigAxiosAuth
    );
    toast.success(`${(data as IBasketGoods).name} добавлен в избранное`);
    return data;
  } catch (error) {
    toast.error(`${(error as Error).message}`);
  } finally {
    setSpinner(false);
  }
};
