import { selectCurrentProductAddBusketState } from "@/shared/stores/current-product-add-busket";
import { ProductCardPage } from "@/widgets/product-card-page";
import Head from "next/head";
import React from "react";
import { useSelector } from "react-redux";

const ProductPage = () => {
  const selectedProduct = useSelector(selectCurrentProductAddBusketState);
  return (
    <>
      <Head>
        <title>
          {selectedProduct?.name || "Карточка товара"} | Rostelecom Shop
        </title>
        <meta
          name="description"
          content={selectedProduct?.description || "Карточка товара"}
        />
      </Head>
      <ProductCardPage />
    </>
  );
};

export default ProductPage;
