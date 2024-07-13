// import { reduxWrapper } from "@/app/store";
import { Main } from "@/pages/main";
import { apiInstance } from "@/shared/config/api/apiinstance";
import { wrapper } from "@/app/store/store";
import { getGoodsSave } from "@/widgets/new-and-hits-goods/store/slice";
import { GetServerSideProps, GetStaticProps } from "next/types";

export default Main;

// eslint-disable-next-line @next/next/no-typos
export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(({ dispatch }) => async () => {
    try {
      const { data: goodsHits } = await apiInstance.get("/api/goods/hits");
      const { data: goodsNew } = await apiInstance.get("/api/goods/new");
      dispatch(getGoodsSave([...goodsHits, ...goodsNew]));
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
