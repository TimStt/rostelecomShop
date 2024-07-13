import { checkEmptyByAuth } from "@/shared/api/check-empty-by-auth";
import { deleteProduct } from "@/shared/api/deleteProduct/deleteProduct";
import { clientPromise } from "@/shared/lib/mongodb/client-promise";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      return await checkEmptyByAuth(clientPromise, req, res, "favorites");
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
      return;
    }
  }
};

export default handler;
