import { RootLayout } from "@/app/root-layout";
import { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import React, { useEffect } from "react";
import { Provider, useStore } from "react-redux";
import { persistStore } from "redux-persist";
import { wrapper } from "./store/store";
import { Toaster } from "react-hot-toast";
import { PersistGate } from "redux-persist/integration/react";
import { useRouter } from "next/router";
import { Spinner } from "@/shared/ui/spinner";
import TransitionWrapper from "@/shared/ui/transition-wrapper/ui";
import { AnimatePresence } from "framer-motion";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  const { store, props } = wrapper.useWrappedStore(pageProps);
  return (
    <>
      <Provider store={store}>
        <NextNProgress
          color="var(--color-violet)"
          height={3}
          options={{ showSpinner: false }}
        />
        <RootLayout>
          <AnimatePresence
            mode="wait"
            initial={true}
            onExitComplete={() => window.scrollTo(0, 0)}
          >
            <Component {...props.pageProps} key={router.asPath} />
          </AnimatePresence>
        </RootLayout>
      </Provider>
    </>
  );
};
export default App;
