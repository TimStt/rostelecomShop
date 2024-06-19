import { apiInstance } from "@/shared/config/api/apiinstance";
import { IConfigAxiosAuth } from "@/shared/config/api/apiinstance/ui";
import { IGetRostelecomOfficeByCity } from "@/shared/config/types/geo";
import {
  IGetRostelecomOfficeByCityResponse,
  IRostelecomOfficeByCity,
} from "@/shared/config/types/geo/types";
import axios from "axios";
import toast from "react-hot-toast";

export const getRostelecomOfficeByCity = async ({
  city,
  lang = "ru",
}: IGetRostelecomOfficeByCity) => {
  try {
    const key = process.env.NEXT_PUBLIC_GEOPIFY_API_KEY;
    const baseUrl = `https://api.geoapify.com/v1/geocode/search?format=json&apiKey=${key}`;
    const { data: citySearch } = await axios.get(
      `${baseUrl}&text=${city}&lang=${lang}`,
      {
        needsAuth: false,
      } as IConfigAxiosAuth
    );
    const { data: officeSearch } = await axios.get(
      `${baseUrl}&text=ростелеком&filter=place:${citySearch.results[0].place_id}`,
      {
        needsAuth: false,
      } as IConfigAxiosAuth
    );
    return (officeSearch as unknown as IRostelecomOfficeByCity).results;
  } catch (error) {
    toast.error((error as Error).message);
  }
};
