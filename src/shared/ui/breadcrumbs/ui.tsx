import { paths, translateWords } from "@/shared/routing/paths";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import style from "./url-nav.module.scss";
import Link from "next/link";
import cls from "classnames";
import { translateToWord } from "@/shared/utils/translateToWord";

const BreadCrumbs = ({
  className,
  nameProduct,
}: {
  className?: string;
  nameProduct?: string;
}) => {
  const pathName = usePathname();
  const [isPath, setIsPath] = React.useState<string[] | undefined>([]);

  useEffect(() => {
    let pathNameArr = pathName?.split("/").filter(Boolean);

    if (nameProduct) {
      pathNameArr?.pop();
      pathNameArr?.push(nameProduct);
      setIsPath(pathNameArr);
      return;
    }
    setIsPath(pathNameArr);
  }, [nameProduct, pathName]);

  if (!pathName) return null;

  console.log(isPath);

  return (
    <nav className={cls(style.root, className)} aria-label="breadcrumbs">
      <Link href={`/`}>Главная</Link>
      {isPath?.map((item, index) => (
        <Link
          key={index}
          href={`/${index > 0 ? `${isPath[index - 1]}/${item}` : `${item}`}`}
        >
          {item.length
            ? translateToWord({
                word: item,
                lang: "ru",
              }) ?? item
            : translateWords.home}
        </Link>
      ))}
    </nav>
  );
};

export default BreadCrumbs;
