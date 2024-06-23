import { getAuthRouteData } from "@/shared/lib/auth/utils/getAuthRouteData";
import { MongoClient, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export const deleteProduct = async (
  clientPromise: Promise<MongoClient>,
  req: NextApiRequest,
  res: NextApiResponse,
  id: string,
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

    await db.collection(collection).deleteOne({
      clientId: id as string,
    });

    res.status(200).json({ id: id });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
};
