import { getAuthRouteData } from "@/shared/lib/auth/utils/getAuthRouteData";
import { clientPromise } from "@/shared/lib/mongodb/client-promise";
import { replaceProductInCollection } from "@/shared/lib/mongodb/utils/replaceProductInCollection";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
const logger = require("../../../../winston");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PATCH") {
    try {
      const { db, validationTokenResult, token } = await getAuthRouteData(
        clientPromise,
        req,
        true
      );

      if (validationTokenResult.status !== 200) {
        res.status(401).json(validationTokenResult);
        return;
      }
      logger.info("reqBody", req.body);
      logger.info("reqBody count", req.body.count);
      const id = req.query.id as string;
      const count = req.body.count as number;

      if (!id || count === null) {
        res.status(400).json({ error: "No id or count provided" });
        return;
      }

      await db.collection("basket").updateOne(
        {
          _id: ObjectId.createFromHexString(id as string) as any,
        },
        { $set: { count: count } }
      );

      res.status(200).json({ count: count, id: id });
    } catch (error: any) {
      logger.error(error);
      res.status(500).json({ error: error.message });
    }
  }
};

export default handler;
