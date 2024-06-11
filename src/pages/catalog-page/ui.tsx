import { translateToWord } from "@/shared/utils/translateToWord";
import { useUrlParams } from "@/shared/utils/url";
import wordDeclension from "@/shared/utils/word-declension/word-declension";
import { CatalogMain } from "@/widgets/catalog-main";
import Head from "next/head";
import { useRouter } from "next/router";

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
          content={`Каталог ${ruCategory || "товаров"}`}
        />
      </Head>
      <CatalogMain />
    </>
  );
};

export default CatalogPage;
