import { apiInstance } from "@/shared/config/api/apiinstance";
import { IConfigAxiosAuth } from "@/shared/config/api/apiinstance/ui";

export const loginCheck = async (token: string) => {
  try {
    const { data } = await apiInstance.get("/api/user/checkLogin", {
      needsAuth: true,
    } as IConfigAxiosAuth);

    // if (data.error) {
    //   await handleJwtError({
    //     errorName: data.error.name,
    //     repeatRequestAfterRefreshData: { functionName: "loginCheck" },
    //   });
    //   return;
    // }

    return data.user;
  } catch (error) {
    new Error((error as Error).message);
  }
};
