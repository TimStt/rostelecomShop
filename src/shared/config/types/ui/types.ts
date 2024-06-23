import { Swiper } from "swiper/types";
import { IBasketGoods, IGoods } from "../goods";
import { IconName } from "@/shared/ui/icon/types";
import {
  IBbox,
  IGetGeolocationUser,
  IRostelecomOfficeByCityData,
  handlerSelectAdress,
} from "../geo";

export interface ISelectUI {
  dataList: string[];
  type: "multiple" | "single";
  onChange: (arg1: string) => void;
  value: string | undefined;
  classname?: string;
  title?: string;
  hiddenTextOption?: string;
  placeholder?: string;
}

export interface IUICheckboxOrder {
  checked: boolean;
  icon?: IconName;
  text: string;
  onChange: (arg1: boolean) => void;
  placeholder?: string;
  value: string;
  disabled?: boolean;
}
export interface IStateOrderSlice {
  statesDeliveryTub: IStatesDeliveryTub;
  statesTabPayment: IStatesTabPayment;
  statesTypePayment: IStatesTypePayment;
  map: any;
  officeGeoData: IRostelecomOfficeByCityData[] | null;
  loadListGeoDataOffice: boolean;
  chooseOfficeAddress: Partial<IRostelecomOfficeByCityData> | null;
  chooseAddressCourier: Partial<IRostelecomOfficeByCityData> | null;
  dataCourierAddress: IRostelecomOfficeByCityData | null;
  loadingOfficeGeoData: boolean;
  isMapModalOpen: boolean;
  showCourierAddressData: boolean;
  loadingGeolacationData: boolean;
  showCourierAddress: boolean;
  userOrderInfo: IUIInfoUserOrder;
  isValidOrderInfo: boolean;
  scrollToRequeredBlock: boolean;
}
export type typeOfKeyNotGeo = Exclude<keyof IStateOrderSlice, "officeGeoData">;

export interface ITabsButtonsOrder {
  stateTubOne?: boolean;
  stateTubTwo?: boolean;
  textOne: string;
  textTwo: string;
  classname?: string;
  type?: "painted" | "outlined-bottom";

  onClick: (activeTab: "tabOne" | "tabTwo") => void;
}

export interface IStatesTabPayment {
  online?: boolean;
  cash?: boolean;
}
export interface IStatesTypePayment {
  cards?: boolean;
  spb?: boolean;
  sberPay?: boolean;
  cashOnOffice?: boolean;
  cardOnOffice?: boolean;
}

export interface IStatesDeliveryTub {
  selfDelivery?: boolean;
  courierDelivery?: boolean;
}

export interface IUIAddressItem {
  address: Partial<IRostelecomOfficeByCityData>;
  handleChooseAddress?: (arg0: Partial<IRostelecomOfficeByCityData>) => void;
  handleUpdateMap?: (arg0: handlerSelectAdress) => Promise<void>;
}

export interface IUITitleBlockOrder {
  number: number;
  title: string;
  classname?: string;
}

export interface IPayViewProps {
  isOrder?: boolean;
  countPoducts: number;
  nameDelivery?: string;
  typePay?: string;
  weight?: number;
}

export type TSwiperInstance = Swiper | null;

export interface IUICounter {
  count: number;
  className?: string;
  product: IGoods | IBasketGoods;
  setCount: (state: number) => void;
  totalCount?: number;
  initialCount?: number;
  updateCountAsync?: boolean;
  oneCurrentCartItemCount?: number;
  disabled?: boolean;
}

export interface IUIEmptyPage {
  title: string;
  subtitle: string;
  discription?: string;
  buttonText: string;
  hasImage?: boolean;
  srcImage?: string;
  backgroundText: string;
}

export interface IUIInfoUserOrder {
  name?: string;
  lastname?: string;
  phone?: string;
  email?: string;
  orderComment?: string;
}
