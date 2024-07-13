import { getAuthRouteData } from "@/shared/lib/auth/utils/getAuthRouteData";
import { MongoClient, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getDataFromDbByCollection } from "../getDataFromDbByCollection";
import { IFavoritesGoods } from "@/shared/config/types/goods";

export const checkEmptyByAuth = async (
  clientPromise: Promise<MongoClient>,
  req: NextApiRequest,
  res: NextApiResponse,
  collection: string
) => {
  try {
    const { db, validationTokenResult } = await getAuthRouteData(
      clientPromise,
      req,
      false
    );

    if (validationTokenResult.status !== 200) {
      res.status(401).json(validationTokenResult);
      return;
    }

    const { goods } = (await getDataFromDbByCollection({
      clientPromise,
      collectionName: "favorites",
      req,
      res,
    })) as { goods: IFavoritesGoods[] };

    res.status(200).json({ isEmpty: !goods?.length });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
};
