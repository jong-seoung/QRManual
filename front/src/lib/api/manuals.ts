import { apiFetch } from "./client";

export interface Manual {
  id: number;
  companyId: number;
  name: string;
  imageUrl: string | null;
  modelCode: string | null;
  releaseYear: number | null;
  serialNumberLocation: string | null;
  productPage: string | null;
  publicStoreLink: string | null;
  createdAt: string;
}

export interface ManualListResult {
  items: Manual[];
  total: number;
  page: number;
  size: number;
}

export interface ManualInput {
  name: string;
  imageUrl?: string;
  modelCode?: string;
  releaseYear?: number;
  serialNumberLocation?: string;
  productPage?: string;
  publicStoreLink?: string;
}

export interface ListManualsQuery {
  page?: number;
  size?: number;
  keyword?: string;
  companyId?: number;
}

function qs(params: Record<string, string | number | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== "");
  if (entries.length === 0) return "";
  return "?" + entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&");
}

export interface PublicManualPayload {
  manual: Manual;
  company: {
    id: number;
    name: string;
    officialMark: boolean;
    homePage: string | null;
  };
  pdfs: {
    id: number;
    manualId: number;
    language: string;
    title: string | null;
    pdfUrl: string;
    originFileName: string | null;
    mimeType: string | null;
    fileSize: number | null;
    createdAt: string;
  }[];
  parts: {
    id: number;
    manualId: number;
    name: string;
    imageUrl: string | null;
    storeLink: string | null;
  }[];
  faqs: {
    id: number;
    manualId: number;
    question: string;
    answer: string;
  }[];
  customerService: {
    id: number;
    manualId: number;
    phone: string | null;
    email: string | null;
    operationTime: string | null;
    chatLink: string | null;
  } | null;
}

export const manualsApi = {
  // QR 스캔 진입 — 인증 불필요
  publicDetail(id: number) {
    return apiFetch<PublicManualPayload>(`/public/manuals/${id}`, { method: "GET" });
  },

  // 공개 카탈로그 — 인증 불필요
  publicList(q: ListManualsQuery = {}) {
    return apiFetch<ManualListResult>(
      `/public/manuals${qs(q as Record<string, string | number | undefined>)}`,
      { method: "GET" },
    );
  },

  list(q: ListManualsQuery = {}, cookieHeader?: string) {
    return apiFetch<ManualListResult>(`/manuals${qs(q as Record<string, string | number | undefined>)}`, {
      method: "GET",
      cookieHeader,
    });
  },

  detail(id: number, cookieHeader?: string) {
    return apiFetch<Manual>(`/manuals/${id}`, { method: "GET", cookieHeader });
  },

  create(payload: ManualInput) {
    return apiFetch<Manual>("/manuals", { method: "POST", body: payload });
  },

  update(id: number, payload: Partial<ManualInput>) {
    return apiFetch<Manual>(`/manuals/${id}`, { method: "PATCH", body: payload });
  },

  remove(id: number) {
    return apiFetch<void>(`/manuals/${id}`, { method: "DELETE" });
  },
};
