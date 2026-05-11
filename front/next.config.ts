import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const config: NextConfig = {
  reactStrictMode: true,
  output: "standalone", // Docker 컨테이너용
  poweredByHeader: false,
  // typedRoutes는 동적 redirect 문자열과 충돌하므로 끔. 필요해지면 다시 켜고 캐스팅.
  typedRoutes: false,
};

export default withNextIntl(config);
