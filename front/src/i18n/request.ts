import { getRequestConfig } from "next-intl/server";

import { defaultLocale, type Locale, locales } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = (await requestLocale) as Locale | undefined;
  const locale: Locale = locales.includes(requested as Locale) ? (requested as Locale) : defaultLocale;
  const messages = (await import(`./messages/${locale}.json`)).default;
  return { locale, messages };
});
