import Modal from "@/shared/ui/modal";
import React, { memo, useCallback, useEffect } from "react";
import style from "./auth-modal.module.scss";
import Icon from "@/shared/ui/icon";

import { LayoutAuth } from "@/widgets/auth-modal/ui/layout-auth";
import { useDispatch, useSelector } from "react-redux";
import { selectActiveForm } from "../../shared/stores/auth/slice";
import LoginAuth from "./ui/login-auth/ui";
import RegisterAuth from "./ui/register-auth/ui";
import { toggleStateModal } from "@/shared/stores/auth-modal";
import { useOpen } from "@/shared/lib/modal";
import { selectOpenModal } from "@/shared/stores/auth-modal/slice";
import { useScrollHidden } from "@/shared/lib/modal/useScrollHidden";
import TransitionWrapper from "@/shared/ui/transition-wrapper/ui";

const AuthModal = () => {
  const refModal = React.createRef<HTMLDialogElement>();
  const activeForm = useSelector(selectActiveForm);
  const isOpenModal = useSelector(selectOpenModal);

  useOpen(isOpenModal, refModal);
  useScrollHidden(isOpenModal);

  return (
    <LayoutAuth modalRef={refModal} type={activeForm}>
      {activeForm.isRegister ? <RegisterAuth /> : <LoginAuth />}
    </LayoutAuth>
  );
};

AuthModal.displayName = "AuthModal";

export default AuthModal;
