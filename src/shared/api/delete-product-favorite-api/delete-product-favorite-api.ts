import { apiInstance } from "@/shared/config/api/apiinstance";
import { IConfigAxiosAuth } from "@/shared/config/api/apiinstance/ui";
import { IProductDeleteOnBd } from "@/shared/config/types/goods";
import toast from "react-hot-toast";

export const deleteProductFavoritesApi = async ({
  id,
  setSpinner,
}: IProductDeleteOnBd) => {
  try {
    setSpinner(true);
    const { data } = await apiInstance.delete(
      `/api/favorites/delete?id=${id}`,
      {
        needsAuth: true,
      } as IConfigAxiosAuth
    );
    return data.id;
  } catch (error) {
    return { status: 500, message: (error as Error).message };
  } finally {
    setSpinner(false);
    toast.success("Товар удален");
  }
};
