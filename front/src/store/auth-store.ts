"use client";

import { create } from "zustand";

import type { AuthUser } from "@/lib/auth/types";

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  clear: () => void;
}

// 쿠키가 진짜 세션. 이 스토어는 *클라이언트 측 캐시*만 — UI 즉시 반영용.
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clear: () => set({ user: null }),
}));
