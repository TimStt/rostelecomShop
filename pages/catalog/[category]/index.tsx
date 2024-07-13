// import { reduxWrapper } from "@/app/store";
import { wrapper } from "@/app/store/store";
import { CatalogPage } from "@/pages/catalog-page";
import { apiInstance } from "@/shared/config/api/apiinstance";
import {
  getGoodsSave,
  getGoodsSaveCount,
} from "@/widgets/catalog-main/store/slice";

import { GetServerSideProps } from "next/types";
import { IfilterState } from "@/shared/config/types/filters";

export default CatalogPage;

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(({ dispatch, getState }) => async (context) => {
    const limitGoods = getState().goodsCatalog.limitPage;
    const { page, sort, price_min, price_max, sizes } =
      context.query as unknown as IfilterState;

    const category = context.params?.category as string;

    if (price_min && +price_min > +price_max) {
      return {
        redirect: {
          destination: `/catalog/${category}/?price_min=${price_max}&price_max=${price_min}`,
          permanent: false,
        },
      };
    }
    const filterQuery = new URLSearchParams({
      page: page,
      sort: sort,
      price_min: price_min,
      price_max: price_max,
      sizes: sizes,
      category: category,
      limit: limitGoods.toString(),
    }).toString();
    try {
      const { data: goods } = await apiInstance.get(
        `/api/goods/catalog-goods?${filterQuery}`
      );

      dispatch(getGoodsSave([...goods.data]));
      dispatch(getGoodsSaveCount(goods.count));

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
