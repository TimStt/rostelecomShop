import { clientPromise } from "@/shared/lib/mongodb/client-promise";
import { replaceProductInCollection } from "@/shared/lib/mongodb/utils/replaceProductInCollection";
import { NextApiRequest, NextApiResponse } from "next/types";
const logger = require("../../../../winston");
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const data = await replaceProductInCollection({
        clientPromise: clientPromise,
        req,
        collection: "favorites",
        res,
      });
      logger.info("replaceProductBasket ", data);

      res.status(200).json({ data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default handler;
