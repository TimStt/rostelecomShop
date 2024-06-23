import { Input } from "@/shared/ui/input";
import { IInputFormOrder } from "@/shared/config/types/auth";
import React, { createRef } from "react";
import { Controller } from "react-hook-form";
import { userInfoData } from "../../user-info.data";
import { massageInputData } from "@/widgets/auth-modal/massage-input.data";
import type { MaskitoOptions } from "@maskito/core";
import { useMaskito } from "@maskito/react";
import { isValidPhoneRules } from "@/shared/lib/auth/utils/validation-rules";
import { IUIInfoUserOrder } from "@/shared/config/types/ui";
import { setUserOrderInfo } from "@/shared/stores/order";
import { useDispatch } from "react-redux";

const InputPhone = ({
  register,
  errors,
  control,
  classname,
  trigger,
}: IInputFormOrder) => {
  const { invalidNumber } = massageInputData;
  const inputRef = createRef<HTMLInputElement>();
  const onFocusInput = () => inputRef.current?.focus();

  const dispatch = useDispatch();
  const onChangeValue = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void
  ) => {
    const value = e.target.value;
    dispatch(setUserOrderInfo({ phone: value }));
    trigger();
    onChange(e);
  };

  const nameInput = userInfoData.phone.key as keyof IUIInfoUserOrder;
  return (
    <Controller
      name={nameInput}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <Input
          className={classname}
          {...register(nameInput, isValidPhoneRules(invalidNumber))}
          variant="input-found"
          value={field.value}
          onChange={(e) => onChangeValue(e, field.onChange)}
          placeholder={userInfoData.phone.placeholder}
          ref={inputRef}
          error={errors.phone?.message as string}
          hasError={errors.phone?.message !== ""}
          onBlur={field.onBlur}
          onFocusInput={onFocusInput}
        />
      )}
    />
  );
};

export default InputPhone;
