import React, { useCallback, useEffect } from "react";
import style from "./login-auth.module.scss";
import { useFormAuth } from "@/shared/utils/useFormAuth";
import { SubmitHandler } from "react-hook-form";

import { signInThunk } from "../../../../shared/stores/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsAuth,
  selectIsLoading,
  signOauthThunk,
  toggleFormIsActive,
} from "../../../../shared/stores/auth/slice";
import { IAuth } from "@/shared/config/types/auth";

import { EmailInput } from "../email-input";
import { PasswordInput } from "../password-input";
import { Spinner } from "@/shared/ui/spinner";
import cls from "classnames";
import TransitionWrapper from "@/shared/ui/transition-wrapper/ui";
import { PulseLoader } from "@/shared/ui/pulse-loader";
import { error } from "console";

const LoginAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const signOauth = useCallback(
    (data: IAuth) => dispatch(signOauthThunk(data)),
    [dispatch]
  );
  const {
    register,
    handleSubmit,
    formErrors,
    control,
    isSubmitted,
    trigger,
    isSubmitting,
  } = useFormAuth(signOauth);

  const isLoadingSignUp = useSelector(selectIsLoading);
  useEffect(() => {
    if (isSubmitted) trigger();
  }, [isSubmitted, trigger]);

  const onSubmit: SubmitHandler<IAuth> = (data) => dispatch(signInThunk(data));

  return (
    <form className={style.root} onSubmit={handleSubmit(onSubmit)}>
      <div className={style["root__input-block"]}>
        <EmailInput register={register} errors={formErrors} control={control} />
        <PasswordInput
          register={register}
          errors={formErrors}
          control={control}
        />
      </div>
      <div className={style.root__bottom}>
        <button
          className={cls(style.root__bottom__submit, "btn-reset")}
          type="submit"
          // disabled={isLoadingSignUp || isSubmitting}
        >
          {isLoadingSignUp ? (
            <PulseLoader size={5} color="#ffffff" gap={4.5} />
          ) : (
            "Войти!"
          )}
        </button>
        <div className={style.root__bottom__text}>
          <span>Еще нет аккаунта? </span>
          <button
            className={cls(style.root__bottom__link, "btn-reset")}
            onClick={() => dispatch(toggleFormIsActive({ isRegister: true }))}
            type="button"
          >
            Создать!
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginAuth;
