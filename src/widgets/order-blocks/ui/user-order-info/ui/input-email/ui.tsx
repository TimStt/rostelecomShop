import { Input } from "@/shared/ui/input";
import { IInputFormOrder } from "@/shared/config/types/auth";
import React, { createRef } from "react";
import { Controller } from "react-hook-form";
import { userInfoData } from "../../user-info.data";
import { massageInputData } from "@/widgets/auth-modal/massage-input.data";

import {
  isValidEmailRules,
  isValidPhoneRules,
} from "@/shared/lib/auth/utils/validation-rules";
import { useDispatch } from "react-redux";
import { setUserOrderInfo } from "@/shared/stores/order";
import { IUIInfoUserOrder } from "@/shared/config/types/ui";

const InputEmail = ({
  register,
  errors,
  control,
  classname,
  trigger,
}: IInputFormOrder) => {
  const { invalidEmail } = massageInputData;
  const inputRef = createRef<HTMLInputElement>();
  const onFocusInput = () => inputRef.current?.focus();

  const dispatch = useDispatch();
  const onChangeValue = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void
  ) => {
    dispatch(setUserOrderInfo({ email: e.target.value }));
    trigger();
    onChange(e);
  };

  const nameInput = userInfoData.email.key as keyof IUIInfoUserOrder;

  return (
    <Controller
      name={nameInput}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <Input
          className={classname}
          {...register(nameInput, isValidEmailRules(invalidEmail))}
          variant="input-found"
          value={field.value}
          onChange={(e) => onChangeValue(e, field.onChange)}
          placeholder={userInfoData.email.placeholder}
          ref={inputRef}
          error={errors.email?.message as string}
          hasError={errors.email?.message !== ""}
          onBlur={field.onBlur}
          onFocusInput={onFocusInput}
        />
      )}
    />
  );
};

export default InputEmail;
