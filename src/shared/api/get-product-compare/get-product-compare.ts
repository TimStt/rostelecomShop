import { apiInstance } from "@/shared/config/api/apiinstance";
import { IConfigAxiosAuth } from "@/shared/config/api/apiinstance/ui";

import toast from "react-hot-toast";

export const getProductCompare = async (category?: string) => {
  try {
    category;
    let filterQuery = new URLSearchParams({});
    if (category) {
      filterQuery = new URLSearchParams({ category: category });
    }
    const { data } = await apiInstance.get(
      `/api/compare/all?${filterQuery.toString()}`,
      {
        needsAuth: true,
      } as IConfigAxiosAuth
    );

    return data.goods;
  } catch (error) {
    toast.error(`${(error as Error).message}`);
  }
};
