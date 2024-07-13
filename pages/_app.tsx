import "@/app/styles/index.scss";
import { wrapper } from "@/app/store/store";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import NextNProgress from "nextjs-progressbar";
import RootLayout from "@/app/root-layout/ui";
import { AnimatePresence } from "framer-motion";
import { ScrollToTop } from "@/shared/utils/scroll-to-top";

const Layout: React.FC<AppProps> = ({ Component, pageProps }) => {
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
export default Layout;
