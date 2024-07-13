import { ProductPage } from "@/pages/product-page";
import { apiInstance } from "@/shared/config/api/apiinstance";
import { IParamsToGetProduct } from "@/shared/config/types/goods";
import { setCurrentProduct } from "@/shared/stores/current-product-add-busket";
import { wrapper } from "@/app/store/store";

import { GetServerSideProps } from "next";

export default ProductPage;

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(({ dispatch }) => async (context) => {
    try {
      // const limitGoods = 12;
      const { category, id_product } =
        context.params as unknown as IParamsToGetProduct;

      const { data: product } = await apiInstance.get(
        `/api/goods/one-product?category=${category}&id_product=${id_product}`
      );

      dispatch(setCurrentProduct(product));

      return {
        props: {},
      };
    } catch (error) {
      console.error(error);
      return {
        props: {},
      };
    }
  });
