import { apiInstance } from "@/shared/config/api/apiinstance";
import { IGoodsList } from "@/shared/config/types/goods/types";
import { clientPromise } from "@/shared/lib/mongodb/client-promise";
import { getdbAndRequest } from "@/shared/lib/mongodb/utils/api-routes";

import { Spinner } from "@/shared/ui/spinner";
import TransitionWrapper from "@/shared/ui/transition-wrapper/ui";
import { Category } from "@/widgets/category";
import { HeroSection } from "@/widgets/hero-section";
import { LiveBrend } from "@/widgets/live-brend";
import { getGoodsSave } from "@/widgets/new-and-hits-goods/store/slice";
import { NewAndHitsGoods } from "@/widgets/new-and-hits-goods/ui";
import axios from "axios";
import { GetServerSideProps, GetStaticProps, NextPage } from "next";

import { useRouter } from "next/router";
import React, { use, useEffect } from "react";
import { useDispatch } from "react-redux";

const Main: NextPage = () => {
  return (
    <>
      <TransitionWrapper>
        <HeroSection />
        <Category />
        <NewAndHitsGoods />
        <LiveBrend />
      </TransitionWrapper>
    </>
  );
};

export default Main;
