import Link from "next/link";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import style from "./menu-items.module.scss";
import { Items } from "../../types/items.interface";
import cls from "classnames";

import Icon from "@/shared/ui/icon";

import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectIsMenu, toggleStateMenus } from "../../store/slice";
import { numberOfDropDown } from "../../item-menu.data";
import { useGetStateOnLocalStorage } from "@/shared/utils/use-get-state-LS/useGetStateOnLocalStorage";

interface MenuItemsProps {
  closeModal: () => void;
  menuItems: Items[];
  level: number;
}

const MenuItems = ({ closeModal, menuItems, level = 1 }: MenuItemsProps) => {
  const isOpenMenus = useSelector(selectIsMenu);
  const dispatch = useDispatch();

  const toggleState = useCallback(
    (
      keySelect: string,
      event: React.MouseEvent<HTMLDetailsElement, MouseEvent>
    ) => {
      event.preventDefault();

      dispatch(toggleStateMenus({ keySelect }));
    },
    [dispatch]
  );

  return (
    <ul className={cls(style.root, style[`root-${level}`])}>
      {menuItems.map((item, index) => {
        const key = `${item.href}_level=${level}_${index}`;

        return (
          <li className={style.root__item} key={index}>
            {item.children ? (
              <>
                <details
                  className={style.root__details}
                  onClick={(event) => toggleState(key, event)}
                  open={isOpenMenus?.[key]}
                >
                  <summary
                    className={style.root__summary}
                    aria-expanded={isOpenMenus?.[key]}
                    aria-controls={`content-${item.href}`}
                  >
                    <span
                      className={cls(
                        "btn-reset",
                        style.root__btn,
                        {
                          [style.isActive]: isOpenMenus?.[key],
                        },
                        style[`root__btn-${level}`]
                      )}
                    >
                      {item.text}
                    </span>
                    <Icon
                      className={cls(
                        style.root__icon,
                        style[`root__icon-${level}`]
                      )}
                      name="common/arrow2"
                    />
                  </summary>
                </details>
                <div
                  className={cls(
                    style.root__content,
                    style[`root__content-${level}`]
                  )}
                  id={`content-${item.href}`}
                >
                  <div className={style.root__wrapper}>
                    <MenuItems
                      menuItems={item.children}
                      closeModal={closeModal}
                      level={level === 3 ? level : level + 1}
                    />
                  </div>
                </div>
              </>
            ) : (
              <Link
                className={cls(style.root__link, style[`root__link-${level}`])}
                href={item.href}
                onClick={closeModal}
              >
                {item.text}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
};
MenuItems.displayName = "MenuItems";

export default memo(MenuItems);
// items.children.map(({ href, text, children }) => (
//           <button className={cls('btn-reset', style.list__children)}>
//             <Link className={style.list__link} href={href}>
//               {text}
//             </Link>
//           </button>
