import { getDataFromDbByCollection } from "@/shared/api/getDataFromDbByCollection";
import { IBasketGoods } from "@/shared/config/types/goods";
import { clientPromise } from "@/shared/lib/mongodb/client-promise";
import { getdbAndRequest } from "@/shared/lib/mongodb/utils/api-routes";
import { findOneOnCollection } from "@/shared/lib/mongodb/utils/find-one-on-collection";
import { NextApiRequest, NextApiResponse } from "next/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      return await getDataFromDbByCollection({
        clientPromise,
        collectionName: "compare",
        req,
        res,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default handler;
