import { apiFetch } from "./client";

export interface Part {
  id: number;
  manualId: number;
  name: string;
  imageUrl: string | null;
  storeLink: string | null;
}

export interface Faq {
  id: number;
  manualId: number;
  question: string;
  answer: string;
}

export interface CustomerService {
  id: number;
  manualId: number;
  phone: string | null;
  email: string | null;
  operationTime: string | null;
  chatLink: string | null;
}

export const partsApi = {
  list(manualId: number) {
    return apiFetch<Part[]>(`/manuals/${manualId}/parts`, { method: "GET" });
  },
  create(manualId: number, payload: { name: string; imageUrl?: string; storeLink?: string }) {
    return apiFetch<Part>(`/manuals/${manualId}/parts`, { method: "POST", body: payload });
  },
  update(id: number, patch: Partial<{ name: string; imageUrl: string; storeLink: string }>) {
    return apiFetch<Part>(`/parts/${id}`, { method: "PATCH", body: patch });
  },
  remove(id: number) {
    return apiFetch<void>(`/parts/${id}`, { method: "DELETE" });
  },
};

export const faqsApi = {
  list(manualId: number) {
    return apiFetch<Faq[]>(`/manuals/${manualId}/faqs`, { method: "GET" });
  },
  create(manualId: number, payload: { question: string; answer: string }) {
    return apiFetch<Faq>(`/manuals/${manualId}/faqs`, { method: "POST", body: payload });
  },
  update(id: number, patch: Partial<{ question: string; answer: string }>) {
    return apiFetch<Faq>(`/faqs/${id}`, { method: "PATCH", body: patch });
  },
  remove(id: number) {
    return apiFetch<void>(`/faqs/${id}`, { method: "DELETE" });
  },
};

export const customerServiceApi = {
  get(manualId: number) {
    return apiFetch<CustomerService | null>(`/manuals/${manualId}/customer-service`, {
      method: "GET",
    });
  },
  upsert(
    manualId: number,
    payload: Partial<{
      phone: string;
      email: string;
      operationTime: string;
      chatLink: string;
    }>,
  ) {
    return apiFetch<CustomerService>(`/manuals/${manualId}/customer-service`, {
      method: "PUT",
      body: payload,
    });
  },
  remove(manualId: number) {
    return apiFetch<void>(`/manuals/${manualId}/customer-service`, { method: "DELETE" });
  },
};
