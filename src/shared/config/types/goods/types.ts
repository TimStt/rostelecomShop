import { Db } from "mongodb";
import { ObjectId } from "mongoose";
import { Interface } from "readline";

export interface IGoods {
  _id: string;
  name: string;
  price: number;
  images: Array<string>;
  description: string;
  vendorCode: string;
  type: string;
  article: number;
  category: "clothes" | "accessories" | "office" | "souvenirs";
  inStock: boolean;
  sizes?: TSize[];
  popularity: number;
  isBestseller: boolean;
  isNew: boolean;
  characteristics: TCharacteristicsGoods;
  isCount: number | undefined;
}

export type TCharacteristicsGoods =
  | ICharacteristicsTShirts
  | ICharacteristicsLongsleeves
  | ICharacteristicsHoodie
  | ICharacteristicsOuterwear
  | ICharacteristicsBags
  | ICharacteristicsUmbrellas
  | ICharacteristicsHeaddress
  | ICharacteristicsOfficeNotebook
  | ICharacteristicsOfficePen
  | ICharacteristicsSouvenirs;

export type IGoodsList = IGoods[];

export type TSize = {
  S?: boolean;
  M?: boolean;
  L?: boolean;
  XL?: boolean;
  XXL?: boolean;
  XXXL?: boolean;
};

export interface IClothes {
  type: string;
  color: string;
  collar: string;
  decor: boolean;
  composition: string;
}

export interface ICharacteristicsWithComposition extends IClothes {
  composition: string;
}

export interface ICharacteristicsOfficeNotebook {
  type: IClothes["type"];
  color: IClothes["color"];
  cover: string;
  ruled: string;
  fastenings: string;
}
export interface ICharacteristicsOfficePen {
  type: IClothes["type"];
  color: IClothes["color"];
  penType: string;
  peculiarity: string;
  frame: string;
}
export interface ICharacteristicsSouvenirs {
  type: IClothes["type"];
  color: IClothes["color"];
  material: string;
  height: number;
  weight: number;
}

export interface ICharacteristicsTShirts extends IClothes {
  silhouette: string;
  print: string;
  season: string;
  collection: string;
}

export interface ICharacteristicsOuterwear extends IClothes {
  features: string;
  upperMaterial: string;
  liningMaterial: string;
  collection: string;
}

export interface ICharacteristicsLongsleeves extends IClothes {
  silhouette: string;
  print: string;
  season: string;
  collection: string;
  features: string;
  fabricType: string;
  sleeve: string;
}

export interface ICharacteristicsHoodie extends IClothes {
  silhouette: string;
  print: string;
  season: string;
  collection: string;
  features: string;
  fabricType: string;
  sleeve: string;
  clasp: boolean;
}

interface IAccessories {
  type: string;
  color: string;
  composition: string;
}

export interface ICharacteristicsBags extends IAccessories {
  collection: string;
  wearingMethod: string;
  texture: string;
  style: string;
}

export interface ICharacteristicsUmbrellas extends IAccessories {
  numberOfSpokes: number;
  spokeMaterial: string;
  foldedLengths: number;
  mechanism: string;
}

export interface ICharacteristicsHeaddress extends IAccessories {
  season: string;
}

export interface IBasketGoods {
  _id?: string;
  clientId: string;
  userId?: string;
  productId: string;
  image: string;
  name: string;
  size: string;
  count: number;
  price: number;
  totalPrice: number;
  inStock: boolean;
  color: string;
  category: "clothes" | "accessories" | "office" | "souvenirs";
  quantityStock: number;
}

export interface IBasketAdd {
  clientId: string;
  userId: string;
  productId: string;

  setSpinner: (state: boolean) => void;
  count: string | number;
  sizes: string;
  category: "clothes" | "accessories" | "office" | "souvenirs";
}

export type ICompareAdd = Omit<IBasketAdd, "count"> & {
  sizes?: TSize[];
};

export interface ICompareData {
  _id: string;
  clientId: string;
  userId: string;
  productId: string;
  image: string;
  sizes?: TSize[];
  name: string;
  characteristics: TCharacteristicsGoods;
  price: number;
  category: string;
  inStock: boolean;
}

export interface IProductReplaceAuth {
  productsReplace: IBasketGoods[] | IFavoritesGoods[] | ICompareData[];
  collection: "favorite" | "basket" | "compare";
}

export interface IBasketUpdateCount {
  id: string;
  count: number;
  setSpinner: (state: boolean) => void;
  jwt: string;
}

export interface IProductDeleteOnBd {
  id: string;

  setSpinner: (state: boolean) => void;
}

export interface IDeleteAllProductOnCollection {
  collection: "favorite" | "basket" | "compare";
}

export type Tcollections =
  | "clothes"
  | "accessories"
  | "basket"
  | "users"
  | "favorites"
  | "compare";

export interface IBasketState {
  goods: IBasketGoods[];
  loading: boolean;
  totalPrice: number;
}
export interface IFavoritesState {
  goods: IFavoritesGoods[];
  loading: boolean;
  isEmpty: boolean;
}
export type ICompareState = Omit<IFavoritesState & IFavoritesState, "goods"> & {
  goods: ICompareData[] | null;
};

export type IStoreName = "basket" | "favorites" | "compare";
export type IFavoritesGoods = IBasketGoods;
export type ICompareGoods = IGoods;

export interface INewSizeClothes {
  size: string;
  ruSize: string;
  chest_circumference: string;
  waist_circumference: string;
  hip_circumference: string;
  isHas: boolean;
}

export interface INewSizeAccessories {
  size: string;
  isHas: boolean;
}

export interface InewSize {
  clothes?: INewSizeClothes[];
  accessories?: INewSizeAccessories[];
}

export interface IParamsToGetProduct {
  category: string;
  id_product: string;
}
export interface IFoundAllGoodsApi {
  value?: string;
  type?: string;
  category?: string;
}

export interface IFoundAllGoods extends IFoundAllGoodsApi {
  db: Db;
}

export interface IGoodsFoundModal {
  _id: IGoods["_id"];
  name: IGoods["name"];
  type: IGoods["type"];
  price: IGoods["price"];
  category: IGoods["category"];
  image: IGoods["images"][0];
}
