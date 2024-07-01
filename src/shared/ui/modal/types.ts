import { HTMLAttributes } from "react";

export interface IModel extends HTMLAttributes<HTMLDialogElement> {
  children: React.ReactNode;
  state?: boolean;
  isOpenFlex?: boolean;
}
