import { IBasketGoods } from "@/shared/config/types/goods";

export const deleteProductByLS = <T>(id: string, name: string = "basket") => {
  const lsProducts = JSON.parse(localStorage.getItem(name) as string) as any[];

  const newProducts = lsProducts.filter((item) => item.clientId !== id);
  localStorage.setItem(name, JSON.stringify(newProducts));
  return newProducts;
};
