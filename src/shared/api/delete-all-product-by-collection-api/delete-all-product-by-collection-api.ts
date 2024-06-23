import { apiInstance } from "@/shared/config/api/apiinstance";
import { IConfigAxiosAuth } from "@/shared/config/api/apiinstance/ui";
import {
  IDeleteAllProductOnCollection,
  IProductDeleteOnBd,
} from "@/shared/config/types/goods";
import { getAuthRouteData } from "@/shared/lib/auth/utils/getAuthRouteData";
import { MongoClient, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export const deleteAllProductApi = async ({
  collection,
}: IDeleteAllProductOnCollection) => {
  try {
    const { data: countDeleted } = await apiInstance.delete(
      `/api/${collection}/delete-all`,
      {
        needsAuth: true,
      } as IConfigAxiosAuth
    );
    return countDeleted;
  } catch (error) {
    return { status: 500, message: (error as Error).message };
  }
};
