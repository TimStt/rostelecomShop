import { Input } from "@/shared/ui/input";
import { IInputFormOrder } from "@/shared/config/types/auth";
import React, { createRef } from "react";
import { Controller } from "react-hook-form";
import { userInfoData } from "../../user-info.data";
import { massageInputData } from "@/widgets/auth-modal/massage-input.data";

import {
  isValidPhoneRules,
  isValidUsernameRules,
} from "@/shared/lib/auth/utils/validation-rules";
import { IUIInfoUserOrder } from "@/shared/config/types/ui";
import { useDispatch } from "react-redux";
import { setUserOrderInfo } from "@/shared/stores/order";

const InputName = ({
  register,
  errors,
  control,
  trigger,
  classname,
}: IInputFormOrder) => {
  const { invalidName } = massageInputData;
  const inputRef = createRef<HTMLInputElement>();
  const onFocusInput = () => inputRef.current?.focus();

  const dispatch = useDispatch();
  const onChangeValue = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void
  ) => {
    const value = e.target.value;
    dispatch(setUserOrderInfo({ name: value }));
    onChange(e);
    trigger();
  };

  const nameInput = userInfoData.name.key as keyof IUIInfoUserOrder;
  return (
    <Controller
      name={nameInput}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <Input
          className={classname}
          {...register(nameInput, isValidUsernameRules(invalidName))}
          variant="input-found"
          value={field.value}
          onChange={(e) => onChangeValue(e, field.onChange)}
          placeholder={userInfoData.name.placeholder}
          ref={inputRef}
          error={errors.name?.message as string}
          hasError={errors.name?.message !== ""}
          onBlur={field.onBlur}
          onFocusInput={onFocusInput}
        />
      )}
    />
  );
};

export default InputName;
