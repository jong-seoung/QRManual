import { NextResponse, type NextRequest } from "next/server";

// 보호 라우트는 refresh_token 쿠키 존재 여부만 체크. 실 검증은 백엔드에 맡김.
const PROTECTED_PREFIXES = ["/admin", "/mypage", "/dashboard"];

export function middleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;
  const protectedPath = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!protectedPath) return NextResponse.next();

  const refresh = req.cookies.get("refresh_token");
  if (!refresh) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/mypage/:path*", "/dashboard/:path*"],
};
