import { useForm } from "react-hook-form";

import { IUser } from "@/shared/config/types/user/types";
import { useEarthoOne } from "@eartho/one-client-react";
import { useCallback, useEffect } from "react";
import { signup } from "@/shared/api/signup";
import { useSelector } from "react-redux";
import { selectOpenModal } from "@/shared/stores/auth-modal/slice";
import { IAuth } from "@/shared/config/types/auth";

const useFormAuth = (dispatchEmailSendData?: (data: IAuth) => void) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    trigger,

    formState: { errors: formErrors, isSubmitted, isSubmitting },
  } = useForm<IUser>();
  const {
    isConnected,
    user,
    connectWithPopup,
    error: earthoError,
  } = useEarthoOne();

  const setData = useCallback(
    (data: IAuth) => {
      if (!dispatchEmailSendData) return;

      dispatchEmailSendData(data);
    },
    [dispatchEmailSendData]
  );

  const isOpenModal = useSelector(selectOpenModal);
  useEffect(() => {
    if (isConnected && isOpenModal && dispatchEmailSendData && user) {
      setData({
        email: user?.email,
        password: user?.uid || "",
        name: user?.displayName,
      });
    }
  }, [dispatchEmailSendData, isConnected, isOpenModal, setData, user]);

  const handleSignUpWithAuth = async () => {
    try {
      await connectWithPopup({
        accessId: `${process.env.NEXT_PUBLIC_ACCESS_ID_AUTH}`,
      });
    } catch (error: any) {
      new Error(error.message);
    }
  };

  return {
    register,
    trigger,
    handleSubmit,
    watch,
    control,
    earthoError,
    isSubmitting,
    isSubmitted,
    formErrors,
    handleSignUpWithAuth,
  };
};

export default useFormAuth;
