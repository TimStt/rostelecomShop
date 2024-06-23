import { IBasketGoods } from "@/shared/config/types/goods";

export const deleteAllProductByLS = (name: string = "basket") =>
  localStorage.removeItem(name);
