import { IUIEmptyPage } from "@/shared/config/types/ui";
import React from "react";
import Image from "next/image";
import style from "./empty-page-content.module.scss";
import { Button } from "../button";
import { paths } from "@/shared/routing";
import cls from "classnames";
import Link from "next/link";

const EmptyPageContent = ({
  title,
  subtitle,
  discription,
  buttonText,
  hasImage = true,
  srcImage = "/empty-page/not-found.png",
  backgroundText,
}: IUIEmptyPage) => {
  return (
    <section
      className={cls(style.root, "container")}
      style={
        {
          "--backgroundText": ` "${backgroundText}"`,
        } as React.CSSProperties
      }
    >
      {hasImage && (
        <Image
          className={style.root__image}
          src={srcImage}
          alt={title}
          width={680.58}
          height={665.78}
        />
      )}
      <div className={style.root__block}>
        <h1
          className={style.root__title}
          dangerouslySetInnerHTML={{ __html: title }}
        ></h1>
        <p
          className={style.root__subtitle}
          dangerouslySetInnerHTML={{ __html: subtitle }}
        ></p>
        {discription && (
          <p
            className={style.root__discription}
            dangerouslySetInnerHTML={{ __html: discription }}
          />
        )}
        <div className={style.root__buttons}>
          <Button
            className={style.root__button}
            as={Link}
            href={paths.catalog}
            variant="primary"
            size="large"
          >
            {buttonText}
          </Button>
          <Button
            className={style.root__button}
            as={Link}
            href={paths.home}
            variant="outline"
            size="large"
          >
            Перейти на главную
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EmptyPageContent;
