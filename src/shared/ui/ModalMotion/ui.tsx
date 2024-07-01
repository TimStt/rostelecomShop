import { motion } from "framer-motion";
import React, { forwardRef } from "react";
import style from "./modal-motion.module.scss";
import { IModel } from "../modal/types";
import cls from "classnames";
import { motionSettingsVisibleDisplay } from "./motion-settings";

const ModalMotion = forwardRef<HTMLDialogElement, IModel>(
  ({ className, children, state, isOpenFlex }, ref) => {
    const styleAnimation = motionSettingsVisibleDisplay(
      state as boolean,
      isOpenFlex
    );
    return (
      <motion.dialog
        className={cls(style.root, className)}
        ref={ref}
        {...styleAnimation}
      >
        {children}
      </motion.dialog>
    );
  }
);

ModalMotion.displayName = "ModalMotion";

export default ModalMotion;
