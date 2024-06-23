import { apiInstance } from "@/shared/config/api/apiinstance";
import { IConfigAxiosAuth } from "@/shared/config/api/apiinstance/ui";
import { IGetGeolocationUser } from "@/shared/config/types/geo";
import axios from "axios";

export const getGeolacationApi = async ({ lat, lon }: IGetGeolocationUser) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEOPIFY_API_KEY;
    const basketUrl = `https://api.geoapify.com/v1/geocode/reverse?`;
    const { data } = await axios.get(
      `${basketUrl}lat=${lat}&lon=${lon}&apiKey=${apiKey}`,
      {
        needsAuth: false,
      } as IConfigAxiosAuth
    );
    return data;
  } catch (error) {
    new Error((error as Error).message);
  }
};
