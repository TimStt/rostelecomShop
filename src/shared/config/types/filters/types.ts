import { ObjectId } from "mongodb";
import { TSize } from "../goods";

export interface IFilters {
  category?: {
    $in: string[] | string;
  };
  price?: {
    $gte?: number;
    $lte?: number;
  };
  $and?: Array<{
    sizes?: {
      $elemMatch?: { [key: string]: boolean };
    };
  }>;

  type?: string;

  isNew?: boolean;
  isBestseller?: boolean;
  email?: string;
  _id?: ObjectId;
  clientId?: string;
  userId?: string;
}

export interface IfilterState {
  page: string;
  category: string;
  sizes: string;
  price_min: string;
  price_max: string;
  type: string;
  sort: string;
}
