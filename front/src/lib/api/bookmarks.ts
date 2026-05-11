import { apiFetch } from "./client";
import type { Manual } from "./manuals";
import type { ManualPdf } from "./manual-pdfs";

export interface BookmarkedManualPdf {
  pdf: ManualPdf;
  manual: Manual;
  company: { id: number; name: string; officialMark: boolean };
}

export const bookmarksApi = {
  listMine(cookieHeader?: string) {
    return apiFetch<BookmarkedManualPdf[]>("/me/bookmarks", { method: "GET", cookieHeader });
  },

  isMine(manualPdfId: number) {
    return apiFetch<{ bookmarked: boolean }>(`/manual-pdfs/${manualPdfId}/bookmark/me`, {
      method: "GET",
    });
  },

  add(manualPdfId: number) {
    return apiFetch<void>(`/manual-pdfs/${manualPdfId}/bookmark`, { method: "POST" });
  },

  remove(manualPdfId: number) {
    return apiFetch<void>(`/manual-pdfs/${manualPdfId}/bookmark`, { method: "DELETE" });
  },
};
