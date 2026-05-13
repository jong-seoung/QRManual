import type { Metadata } from "next";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { Header } from "@/components/header/header";

import "./globals.css";

export const metadata: Metadata = {
  title: "QRManual",
  description: "QR로 매뉴얼·제품 정보를 즉시 보여주는 서비스",
};

const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <div className="flex-1">{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
