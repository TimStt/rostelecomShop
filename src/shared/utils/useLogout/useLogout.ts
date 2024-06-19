import { setAuth } from "@/shared/stores/auth";
import { useEarthoOne } from "@eartho/one-client-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useLogout = () => {
  const { logout } = useEarthoOne();
  const router = useRouter();

  return () => {
    logout();
    localStorage.removeItem("tokens");
    router.push("/");
    router.reload();
  };
};

export default useLogout;
