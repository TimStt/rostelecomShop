import { IFilters } from "@/shared/config/types/filters";
import { IGoods, IGoodsList } from "@/shared/config/types/goods/types";
import { CollectionInfo } from "mongodb";
import { skip } from "node:test";
import { Isettings } from "./types";
import { summirizeArray } from "@/shared/utils/summirizeArray";
import { notFoundList } from "@/shared/config/constants/not-found-collection";

export const getAllGoods = async ({
  db,
  filter,
  sort,
  limit,
  page = 0,
  returnTotatCount,
}: Isettings) => {
  try {
    const collection = await db.listCollections().toArray();
    const collectionNames = collection.map((item: CollectionInfo) => item.name);

    let data: any[] = [];

    for (const collectionName of collectionNames) {
      if (!notFoundList.includes(collectionName)) {
        data = [
          ...data,
          ...(await db
            .collection(collectionName)
            .find(filter || {})
            .sort(sort || {})
            .toArray()),
        ];
      }
    }

    const count = returnTotatCount ? data.length : 0;

    limit = limit || data.length;

    const limitPage = limit * (page ? page - 1 : 0);
    data = data.slice(limitPage, limitPage + limit);

    return { data, count };
  } catch (error) {
    console.error(error);
    throw new Error("Error getting goods" + (error as Error).message);
  }
};
