import { Input } from "@/shared/ui/input";
import { IInputFormOrder } from "@/shared/config/types/auth";
import React, { createRef } from "react";
import { Controller } from "react-hook-form";
import { userInfoData } from "../../user-info.data";
import { massageInputData } from "@/widgets/auth-modal/massage-input.data";

import { isValidPhoneRules } from "@/shared/lib/auth/utils/validation-rules";
import { IUIInfoUserOrder } from "@/shared/config/types/ui";
import { useDispatch } from "react-redux";
import { setUserOrderInfo } from "@/shared/stores/order";

const InputTextarea = ({
  register,
  errors,
  control,
  classname,
  trigger,
}: IInputFormOrder) => {
  const { invalidMaxLenght } = massageInputData;
  const inputRef = createRef<HTMLInputElement>();
  const onFocusInput = () => inputRef.current?.focus();
  const nameInput = userInfoData.orderComment.key as keyof IUIInfoUserOrder;
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
  return (
    <Controller
      name={nameInput}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <Input
          className={classname}
          {...register(nameInput, {
            maxLength: 255,
            pattern: {
              value: /^[\s\S]{0,255}$/,
              message: invalidMaxLenght,
            },
          })}
          as="textarea"
          value={field.value}
          onChange={(e) => onChangeValue(e, field.onChange)}
          placeholder={userInfoData.orderComment.placeholder}
          ref={inputRef}
          error={errors.orderComment?.message as string}
          hasError={errors.orderComment?.message !== ""}
          onBlur={field.onBlur}
          onFocusInput={onFocusInput}
          hasCounterSymbol={true}
          maxLength={255}
          variant="input-found"
        />
      )}
    />
  );
};

export default InputTextarea;
