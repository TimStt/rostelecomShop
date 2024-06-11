import CatalogCards from "@/features/catalog-cards";
import { CatalogPage } from "@/pages/catalog-page";
import { apiInstance } from "@/shared/config/api/apiinstance";
import { IGoods } from "@/shared/config/types/goods";
import { BreadCrumb } from "@/shared/ui/breadcrumbs";
import TransitionWrapper from "@/shared/ui/transition-wrapper/ui";
import {
  getGoodsSave,
  getGoodsSaveCount,
  selectIsCatalag,
  setLoadingCatalog,
} from "@/widgets/catalog-main/store/slice";
import Filter from "@/widgets/catalog-main/ui/filter";

import { GetServerSideProps, GetStaticProps, NextPage } from "next/types";

import { wrapper } from "@/shared/stores/store";

import { CatalogMain } from "@/widgets/catalog-main";
import { IfilterState } from "@/shared/config/types/filters";

export default CatalogPage;

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(({ dispatch, getState }) => async (context) => {
    const limitGoods = getState().goodsCatalog.limitPage;
    const { page, sort, price_min, price_max, sizes } =
      context.query as unknown as IfilterState;

    if (price_min && +price_min > +price_max) {
      return {
        redirect: {
          destination: `/catalog?price_min=${price_max}&price_max=${price_min}`,
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

      limit: limitGoods.toString(),
    }).toString();
    try {
      // const limitGoods = 12;
      dispatch(setLoadingCatalog(true));

      const { data: goods } = await apiInstance.get(
        `/api/goods/catalog-goods?${filterQuery}`
      );

      dispatch(getGoodsSave(goods.data));
      dispatch(getGoodsSaveCount(goods.count));
      return {
        props: {},
      };
    } catch (error) {
      console.error(error);
      return {
        props: {},
      };
    } finally {
      dispatch(setLoadingCatalog(false));
    }
  });
