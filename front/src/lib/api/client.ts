// 공용 fetch 래퍼.
// - 서버 컴포넌트: 호출자가 cookies()로 cookie 헤더를 직접 전달
// - 클라이언트 컴포넌트: credentials: "include"로 브라우저가 쿠키 자동 첨부

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

export interface ApiError {
  status: number;
  code: string;
  message: string;
}

interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  cookieHeader?: string; // 서버 컴포넌트에서 명시적으로 전달
}

export async function apiFetch<T = unknown>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { body, cookieHeader, headers, ...rest } = opts;
  const url = path.startsWith("http") ? path : `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const init: RequestInit = {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  };

  const res = await fetch(url, init);

  if (!res.ok) {
    let payload: { error?: { code?: string; message?: string } } = {};
    try {
      payload = (await res.json()) as typeof payload;
    } catch {
      // 무시
    }
    const err: ApiError = {
      status: res.status,
      code: payload.error?.code ?? "UNKNOWN",
      message: payload.error?.message ?? `HTTP ${res.status}`,
    };
    throw err;
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}
