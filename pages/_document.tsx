import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ru">
      <Head>
        <meta
          name="google-site-verification"
          content="K5UeGmyszUl2tshFZOyaxHD0U_rfJtkKHIqxwsHQ5gI"
        />
        <meta name="yandex-verification" content="3878663dc9f8a600" />
        <script
          async
          src="https://api.tomtom.com/maps-sdk-for-web/cdn/plugins/SearchBox/3.1.3-public-preview.0/SearchBox-web.js"
        />
        <script
          async
          src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.1.2-public-preview.15/services/services-web.min.js"
        />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
