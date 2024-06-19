import React, { useState } from "react";
import { useFormAuth } from "@/shared/utils/useFormAuth";
import style from "./register-auth.module.scss";
import { SubmitHandler } from "react-hook-form";
import cls from "classnames";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsAuth,
  selectIsLoading,
  signOauthThunk,
  signUpThunk,
  toggleFormIsActive,
} from "../../../../shared/stores/auth/slice";
import { IAuth } from "@/shared/config/types/auth";

import { massageInputData } from "../../massage-input.data";

import { NameInput } from "../name-input";
import { EmailInput } from "../email-input";
import { PasswordInput } from "../password-input";
import { Spinner } from "@/shared/ui/spinner";
import TransitionWrapper from "@/shared/ui/transition-wrapper/ui";
import { PulseLoader } from "@/shared/ui/pulse-loader";

const RegisterAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const handlerSignOaut = (data: IAuth) => dispatch(signOauthThunk(data));
  const { register, handleSubmit, formErrors, control, isSubmitting } =
    useFormAuth(handlerSignOaut);

  const isLoadingSignUp = useSelector(selectIsLoading);

  const onSubmit: SubmitHandler<IAuth> = (data) => dispatch(signUpThunk(data));

  return (
    <form className={style.root} onSubmit={handleSubmit(onSubmit)}>
      <div className={style["root__input-block"]}>
        <NameInput register={register} errors={formErrors} control={control} />
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
          disabled={isLoadingSignUp || isSubmitting}
        >
          {isLoadingSignUp ? (
            <PulseLoader size={5} color="#ffffff" gap={4.5} />
          ) : (
            "Создать!"
          )}
        </button>
        <div className={style.root__bottom__text}>
          <span>Уже есть аккаунт? </span>
          <button
            className={cls(style.root__bottom__link, "btn-reset")}
            onClick={() => dispatch(toggleFormIsActive({ isLogin: true }))}
          >
            Войти!
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterAuth;
