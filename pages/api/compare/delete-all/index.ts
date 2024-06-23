import { deleteAllProductOnCollection } from "@/shared/api/delete-all-product-on-collection";
import { deleteProduct } from "@/shared/api/deleteProduct/deleteProduct";
import { clientPromise } from "@/shared/lib/mongodb/client-promise";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "DELETE") {
    try {
      return await deleteAllProductOnCollection(
        clientPromise,
        req,
        res,

        "compare"
      );
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }
};

export default handler;
