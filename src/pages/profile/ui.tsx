// pages/profile.js
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/shared/stores/user";
import { ProtectedRoute } from "@/shared/ui/protected-route";
import style from "./profile.module.scss";
import { BreadCrumb } from "@/shared/ui/breadcrumbs";
import cls from "classnames";
import { Button } from "@/shared/ui";
import { useLogout } from "@/shared/utils/useLogout";
import { setAuth } from "@/shared/stores/auth";
import { useImageProfile } from "@/shared/lib/auth/utils/useImageProfile";

const Profile = () => {
  const { user } = useSelector(selectUser);
  const handleLogout = useLogout();
  const dispatch = useDispatch();
  const { src, alt } = useImageProfile();
  const handleLogoutClick = () => {
    handleLogout();
    dispatch(setAuth(false));
  };

  return (
    <ProtectedRoute>
      <section className={cls(style.root, "container")}>
        <BreadCrumb className={style.root__urlNav} />
        <h1 className={style.root__title}>Профиль</h1>

        <div className={style.root__info}>
          <Image
            className={style.root__image}
            src={src || "/profile/empty.webp"}
            alt={alt || "Аватарка"}
            width={100}
            height={100}
          />
          <span>Имя: {user?.name || "Отсутствует"}</span>
        </div>

        <div className={style.root__orders}>
          <h2>История заказов</h2>
          {
            /* // <ul>
            //   {user.orders.map((order) => (
            //     <li key={order.id}>
            //       Заказ #{order.id}: {order.date} - {order.total}
            //     </li>
            //   ))}
            // </ul> */
            <span className={style.root__orders__empty}>Пока нет заказов</span>
          }
        </div>

        <Button
          className={style.root__logaout}
          onClick={handleLogout}
          size="small"
          variant="primary"
        >
          Выйти
        </Button>
      </section>
    </ProtectedRoute>
  );
};

export default Profile;
