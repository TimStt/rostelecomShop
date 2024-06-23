import { notFoundList } from "@/shared/config/constants/not-found-collection";
import { IFoundAllGoods, IGoods } from "@/shared/config/types/goods";
import { CollectionInfo } from "mongodb";

const foundAllProduct = async ({
  db,
  value,
  type,
  category,
}: IFoundAllGoods) => {
  try {
    const collection = await db.listCollections().toArray();
    const collectionNames = collection.map((item: CollectionInfo) => item.name);

    let result: Promise<IGoods[]>[] = [];

    const pipline = (name: string) => {
      const stages = [];

      if (!!value?.length) {
        stages.push({
          $search: {
            index: name,
            autocomplete: {
              query: value,
              path: "name",
              tokenOrder: "sequential",
            },
          },
        });
      }
      if (!!type) {
        stages.push({
          $match: {
            type: type.replaceAll("_", "-"),
          },
        });
      }
      if (!!category) {
        stages.push({
          $match: {
            category: category.replaceAll("_", "-"),
          },
        });
      }
      stages.push({ $limit: 10 });
      stages.push({
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          images: 1,
          type: 1,
          category: 1,
        },
      });
      return stages;
    };

    for (const name of collectionNames) {
      const stage = pipline(name);
      if (!notFoundList.includes(name) || name === "accessories") {
        result.push(
          db.collection(name).aggregate(stage).toArray() as Promise<IGoods[]>
        );
      }
    }

    const products = await Promise.all(result);

    return products.reduce((acc, cur) => [...acc, ...cur], []);
  } catch (error) {
    console.error(error);
    throw new Error("Error found goods" + (error as Error).message);
  }
};

export default foundAllProduct;
