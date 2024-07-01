import { TActiveForm } from "@/shared/config/types/auth";
import { HTMLAttributes } from "react";

export interface IAuthLayout extends HTMLAttributes<HTMLDialogElement> {
  children: React.ReactNode;
  modalRef?: React.Ref<HTMLDialogElement>;
  modalInnerRef?: React.Ref<HTMLDivElement>;
  closeModal: () => void;
  type?: TActiveForm;
  classname?: string;
}
