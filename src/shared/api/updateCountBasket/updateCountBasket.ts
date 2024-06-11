import { apiInstance } from "@/shared/config/api/apiinstance";
import { IBasketUpdateCount } from "@/shared/config/types/goods";
// import { handleJwtError } from "@/shared/lib/auth/utils/handleJwtError/error";
import toast from "react-hot-toast";

export const updateCountBasket = async ({
  jwt,
  setSpinner,
  id,
  count,
}: IBasketUpdateCount) => {
  try {
    setSpinner(true);
    const { data } = await apiInstance.patch(
      `/api/basket/update_count?id=${id}`,

      { count },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    // if (data.error) {
    //   const res = await handleJwtError({
    //     errorName: data.error.name,
    //     repeatRequestAfterRefreshData: {
    //       functionName: "updateCountBasket",
    //       payload: { setSpinner, id, count },
    //     },
    //   });
    //   return res;
    // }

    return data;
  } catch (error) {
    toast.error(`${(error as Error).message}`);
  } finally {
    setSpinner(false);
  }
};
