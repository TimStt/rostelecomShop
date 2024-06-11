import { CatalogMain } from "@/widgets/catalog-main";
import Head from "next/head";

const CatalogPage = () => {
  return (
    <>
      <Head>
        <title>Каталог товаров | Rostelecom Shop</title>
        <meta name="description" content="Каталог товаров" />
      </Head>
      <CatalogMain />
    </>
  );
};

export default CatalogPage;
