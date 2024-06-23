import Footer from "@/widgets/footer";
import Header from "@/widgets/header";
import { EarthoOneProvider } from "@eartho/one-client-react";

import { Seo } from "./seo";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import SizesTableModal from "@/shared/ui/sizes-table-modal/ui";
import { QuickViewModal } from "@/shared/ui/quick-view-modal";
import { CookieAlert } from "@/widgets/cookie-alert";
import { useWatchByCookie } from "@/shared/utils/useWatchByCookie";
import { PopupShare } from "@/widgets/product-card-page/ui/popup-";
import { MapModal } from "@/widgets/order-blocks/ui/map-modal";
import FoundModal from "@/entities/found-modal";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isClient, setClient] = useState(false);
  const [isOpenCokieAlert, setCokieAlertOpen] = useState(false);

  useWatchByCookie("RostelecomShop", setCokieAlertOpen);

  useEffect(() => {
    setClient(true);
  }, []);
  return (
    <>
      {isClient ? (
        <>
          <EarthoOneProvider
            clientId={process.env.NEXT_PUBLIC_CLIENT_ID as string}
            domain={process.env.NEXT_PUBLIC_DOMAIN as string}
          >
            <Toaster position="top-center" reverseOrder={false} />
            <Seo />
            <Header />
            <main>{children}</main>
            <Footer />
            <SizesTableModal />
            <QuickViewModal />
            <CookieAlert
              setCokieAlertOpen={setCokieAlertOpen}
              stateCokieAlert={isOpenCokieAlert}
            />
            <PopupShare />
            <FoundModal />
          </EarthoOneProvider>
        </>
      ) : (
        <>
          <Seo />
          <main>{children}</main>
        </>
      )}
    </>
  );
};
export default RootLayout;
