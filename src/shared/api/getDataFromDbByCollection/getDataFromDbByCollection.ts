import { IFilters } from "@/shared/config/types/filters";
import { IGoods, Tcollections } from "@/shared/config/types/goods";
import { IUser } from "@/shared/config/types/user/types";
import { getAuthRouteData } from "@/shared/lib/auth/utils/getAuthRouteData";
import { parseJwt } from "@/shared/lib/auth/utils/parseJwt";
import { findOneOnCollection } from "@/shared/lib/mongodb/utils/find-one-on-collection";
import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

interface IGetDataFromDbByCollection {
  clientPromise: Promise<MongoClient>;
  collectionName: Tcollections;

  req: NextApiRequest;
  res: NextApiResponse;
}

export const getDataFromDbByCollection = async ({
  clientPromise,
  collectionName,
  req,
  res,
}: IGetDataFromDbByCollection): Promise<any> => {
  const { db, token, validationTokenResult } = await getAuthRouteData(
    clientPromise,
    req,
    false
  );

  const { category } = req.query;
  if (validationTokenResult.status !== 200) {
    res.status(401).json(validationTokenResult);
    return;
  }

  let filter: {
    [key: string]: any;
  } = {};

  const user = (
    (await findOneOnCollection({
      db: db,
      collectionName: "users",
      filter: { email: parseJwt(token as string).email },
    })) as IUser[]
  )[0];
  if (!!category?.length) filter.category = category;

  const goods = await findOneOnCollection({
    db: db,
    collectionName: collectionName,
    filter: { userId: user._id, ...filter },
  });

  res.status(200).json({ goods, user });
  return;
};
