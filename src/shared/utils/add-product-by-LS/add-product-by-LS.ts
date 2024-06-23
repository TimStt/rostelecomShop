import { IBasketGoods } from "@/shared/config/types/goods";

export const addProductByLS = (product: any, name: string = "basket") => {
  let lsProducts = JSON.parse(localStorage.getItem(name) as string) as any[];

  if (!lsProducts) {
    localStorage.setItem(name, JSON.stringify([product]));
    return [product];
  }

  const newProducts = [...lsProducts, product];
  localStorage.setItem(name, JSON.stringify(newProducts));
  return newProducts;
};
