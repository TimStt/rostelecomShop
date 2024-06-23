import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormTrigger,
} from "react-hook-form";
import { IUser } from "../user/types";
import { NextApiRequest } from "next";
import { IUIInfoUserOrder } from "../ui";

export interface IAuthState {
  isOAuth: boolean;
  isLoading: boolean;
  activeForm: TActiveForm;
  loginCheckLoading: boolean;
}

export type TActiveForm = {
  isLogin?: boolean;
  isRegister?: boolean;
};

export interface IAuth {
  email?: string;
  password: string;
  name?: string;
  isOAuth?: boolean;
}

export interface IInputForm {
  register: UseFormRegister<IUser>;
  errors: FieldErrors<IUser>;
  control: Control<IUser, any>;
  classname?: string;
}

export interface IInputFormOrder {
  register: UseFormRegister<IUIInfoUserOrder>;
  errors: FieldErrors<IUIInfoUserOrder>;
  control: Control<IUIInfoUserOrder, any>;
  classname?: string;
  trigger: UseFormTrigger<IUIInfoUserOrder>;
}

export interface IExtendedNextApiRequest extends NextApiRequest {
  body: IAuth;
}

export interface IResponseData {
  tokens?:
    | { error: any }
    | {
        accessToken: string;
        refreshToken: string;
      };
  warningMessage?: string;
  error?: string;
}
