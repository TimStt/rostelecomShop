import { ElementType, InputHTMLAttributes } from "react";

export interface IInput<E extends ElementType = ElementType>
  extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: string;
  togglePassword?: boolean;
  hasError?: boolean;
  onClear?: () => void;
  variant?: "input-form" | "input-found";
  onFocusInput?: () => void;
  hasIconFound?: boolean;
  as?: E | React.ComponentType<any>;
  hasCounterSymbol?: boolean;
  maxLength?: number;
}
