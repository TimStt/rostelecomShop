import { selectIsAuth } from "@/shared/stores/auth";
import { selectUser } from "@/shared/stores/user";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const useImageProfile = () => {
  const { user } = useSelector(selectUser);
  const [isSrc, setSrc] = useState<string | null>();

  const isOAuth = useSelector(selectIsAuth);

  useEffect(() => {
    if (!isOAuth) return;
    if (user?.image?.length) {
      setSrc(user.image);
      return;
    }

    const srcAuth = JSON.parse(
      localStorage.getItem(
        "@@oneclientjs@@::BbNo8gYph2i8nkr1Mu5k::@@user@@"
      ) as string
    )?.decodedToken?.user?.photoURL;

    srcAuth && setSrc(srcAuth);
  }, [user?.image, isOAuth, user]);

  console.log(isSrc);

  return {
    src: isSrc,
    alt: user?.name || "фото профиля",
  };
};

export default useImageProfile;
