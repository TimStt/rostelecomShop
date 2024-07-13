import { deleteProduct } from "@/shared/api/deleteProduct/deleteProduct";
import { clientPromise } from "@/shared/lib/mongodb/client-promise";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "DELETE") {
    try {
      return await deleteProduct(
        clientPromise,
        req,
        res,
        req.query.id as string,
        "favorites"
      );
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }
};

export default handler;
