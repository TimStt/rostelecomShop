import Link from "next/link";
import React, {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import style from "./input.module.scss";

import type { ElementType, HTMLInputTypeAttribute } from "react";

import { IInput } from "./types";
import cls from "classnames";
import Icon from "../icon";
import { useController } from "react-hook-form";

export const Input = forwardRef<HTMLInputElement, IInput>(
  (
    {
      className,
      error,
      togglePassword,
      hasError,
      onClear,
      onChange,
      onBlur,
      value,
      type = "text",
      placeholder,
      variant = "input-form",
      onFocusInput,
      hasIconFound = false,
      as,
      hasCounterSymbol,
      maxLength,
      ...props
    },
    ref
  ) => {
    const [isFocus, setFocus] = useState<boolean>(false);
    const [isType, setType] = useState<HTMLInputTypeAttribute>(type);
    const DEFOULT_ELEMENT: ElementType = "input";
    const Element = as || DEFOULT_ELEMENT;
    const randomKey = useId();

    const [isCountSymbol, setCountSymbol] = useState<number>(0);

    useEffect(() => {
      if (!hasCounterSymbol || !maxLength) return;
      const countSymbol = (value as string).length;
      if (countSymbol <= maxLength && countSymbol !== isCountSymbol) {
        setCountSymbol(countSymbol);
      }
    }, [hasCounterSymbol, isCountSymbol, maxLength, value]);

    const toggleViewPassword = () => {
      setType(isType === "password" ? "text" : "password");
      onFocusInput;
    };

    const handlerFocused = (e: React.FocusEvent<HTMLInputElement>) => {
      !e.target.value && setFocus(false);
    };

    return (
      <div className={cls(style.root, className)}>
        <div className={style.root__input}>
          <label
            className={cls(style.root__placeholder, {
              [style.isFocus]: isFocus,
              [style.hasIconFound]: hasIconFound,
              [style.isTextarea]: as === "textarea",
            })}
            htmlFor={`input-${randomKey}`}
          >
            {placeholder}
          </label>
          <Element
            className={cls(
              "input-reset",
              style.field,
              {
                [style.isError]: hasError,
                [style.hasPassword]: togglePassword,
                [style.hasIconFound]: hasIconFound,
              },
              style[variant],
              { [style.hasIcon]: onClear || togglePassword }
            )}
            id={`input-${randomKey}`}
            aria-describedby={`${randomKey}-error`}
            onBlur={handlerFocused}
            type={isType}
            onChange={onChange}
            value={value}
            ref={ref}
            {...props}
            onFocus={() => setFocus(true)}
            maxLength={maxLength}
          />
          {onClear && (
            <button
              className={cls(style.root__clear, "btn-reset", {
                [style.isVisible]: isFocus,
              })}
              onClick={onClear}
              title="Очистить поле ввода"
            >
              <Icon name="common/rubbish-bin" />
              <span className="visually-hidden">Очистить поле ввода</span>
            </button>
          )}
          {togglePassword && (
            <button
              className={cls(
                style["root__toggle-password"],
                "btn-reset",
                style[isType],
                {
                  [style.isVisible]: isFocus,
                }
              )}
              onClick={toggleViewPassword}
              type="button"
            >
              <Icon
                name={`common/${isType === "password" ? "eys" : "no-eys"}`}
              />
              <span className="visually-hidden">
                {isType === "password" ? "показать" : "скрыть"} пароль
              </span>
            </button>
          )}

          {hasIconFound && (
            <Icon
              className={cls(style.root__found, {
                [style.isActive]: isFocus,
              })}
              name="goods/found"
            />
          )}
        </div>

        {hasCounterSymbol && (
          <span
            className={cls(style.root__counter, {
              [style.isMax]: isCountSymbol === maxLength,
            })}
          >
            {isCountSymbol}/{maxLength}
          </span>
        )}
        {hasError && (
          <span
            className={cls(style.root__error, {
              [style.isVisible]: hasError,
            })}
            id={`${randomKey}-error`}
            role="alert"
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
