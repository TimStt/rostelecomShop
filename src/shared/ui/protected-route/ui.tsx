import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectIsAuth, toggleFormIsActive } from "@/shared/stores/auth";
import { Spinner } from "@/shared/ui/spinner";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import toast from "react-hot-toast";
import { toggleStateModal } from "@/shared/stores/auth-modal";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const router = useRouter();
  const isAuth = useSelector(selectIsAuth);
  const refFirstRender = useRef(true);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isAuth && refFirstRender.current) {
      refFirstRender.current = false;
      toast.error("Вы не авторизованы");
      router.push("/");
      dispatch(toggleStateModal(true));
    }
  }, [isAuth, router, dispatch]);
  return isAuth ? children : <Spinner size={50} />;
};

export default ProtectedRoute;
