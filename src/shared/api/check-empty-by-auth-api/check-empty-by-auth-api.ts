import { apiInstance } from "@/shared/config/api/apiinstance";
import { IConfigAxiosAuth } from "@/shared/config/api/apiinstance/ui";
import { TMainStoreClient } from "@/shared/config/types/goods";

export const checkEmptyByAuthApi = async ({
  collection,
}: {
  collection: TMainStoreClient;
}) => {
  try {
    const { data: isEmptyState } = await apiInstance.get(
      `/api/${collection}/check-empty`,
      {
        needsAuth: true,
      } as IConfigAxiosAuth
    );

    return isEmptyState;
  } catch (err) {
    return { status: 500, message: (err as Error).message };
  }
};
