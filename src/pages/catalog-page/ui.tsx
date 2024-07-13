import { translateToWord } from "@/shared/utils/translateToWord";
import { useUrlParams } from "@/shared/utils/url";
import wordDeclension from "@/shared/utils/word-declension/word-declension";
import { CatalogMain } from "@/widgets/catalog-main";
import { ViewGoods } from "@/widgets/view-goods";
import Head from "next/head";
import { useRouter } from "next/router";
import style from "./catalog.module.scss";

const CatalogPage = () => {
  const route = useRouter();
  const { category } = route.query;
  const ruCategory =
    wordDeclension[
      translateToWord({
        word: category as string,
        lang: "ru",
      }).toLowerCase() as keyof typeof wordDeclension
    ];
  return (
    <>
      <Head>
        <title>Каталог {ruCategory || "товаров"} | Rostelecom Shop</title>
        <meta
          name="description"
          content={`Каталог ${
            ruCategory || "товаров"
          } магазина Rostelecom Shop. Купить качественную одежду, аксессуары, канцелярию и сувениры по низким ценам от личного бренда Rostelecom. Купить хиты и новинки от личного бренда Rostelecom`}
        />
      </Head>
      <div className={style.root}>
        <CatalogMain />
        <ViewGoods />
      </div>
    </>
  );
};

export default CatalogPage;
