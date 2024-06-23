import { getAuthRouteData } from "@/shared/lib/auth/utils/getAuthRouteData";
import { MongoClient, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export const deleteAllProductOnCollection = async (
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

    const { deletedCount } = await db.collection(collection).deleteMany();

    res.status(200).json({ countDeleted: deletedCount });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
};
