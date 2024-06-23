import { getDataFromDbByCollection } from "@/shared/api/getDataFromDbByCollection";
import { IBasketGoods, IGoods } from "@/shared/config/types/goods";
import { IUser } from "@/shared/config/types/user/types";
import { getAuthRouteData } from "@/shared/lib/auth/utils/getAuthRouteData";
import { parseJwt } from "@/shared/lib/auth/utils/parseJwt";
import { clientPromise } from "@/shared/lib/mongodb/client-promise";
import { findOneOnCollection } from "@/shared/lib/mongodb/utils/find-one-on-collection";
import { ObjectId } from "mongodb";
import { FilterQuery } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

const logger = require("../../../../winston");

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db, validationTokenResult, reqBody, token } =
      await getAuthRouteData(clientPromise, req, true);

    if (validationTokenResult.status !== 200) {
      res.status(401).json(validationTokenResult);
      return;
    }

    if (!reqBody?.product || Object.keys(reqBody.product).length < 4) {
      res.status(400).json({ message: "Not all fields passed" });
      return;
    }

    const { category, productId, sizes, clientId } = reqBody.product;

    const user = (
      (await findOneOnCollection({
        db: db,
        collectionName: "users",
        filter: { email: parseJwt(token as string).email },
      })) as IUser[]
    )[0];

    const productItem = await db.collection(category).findOne({
      _id: ObjectId.createFromHexString(productId as string) as any,
    });

    if (!productItem) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const newFavoriteItem = {
      userId: user?._id,
      productId: productItem._id,
      image: productItem.images[0],
      name: productItem.name,
      size: sizes,
      price: productItem.price,
      totalPrice: productItem.price,
      inStock: productItem.inStock,
      clientId: clientId,
      category: category,
      characteristics: productItem.characteristics,
    };

    const { insertedId } = await db
      .collection("compare")
      .insertOne(newFavoriteItem);

    res.status(200).json({ _id: insertedId, ...newFavoriteItem });
  } catch (error) {
    logger.error(error);
    throw new Error((error as Error).message);
  }
}
export default handler;
