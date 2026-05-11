"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { ApiError } from "@/lib/api/client";
import { companyApi, type Member } from "@/lib/api/company";

const ROLE_OPTIONS: ("OWNER" | "ADMIN" | "USER")[] = ["OWNER", "ADMIN", "USER"];

export function MembersSection({
  canManage,
  currentUserId,
}: {
  canManage: boolean;
  currentUserId: number;
}) {
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  function refresh() {
    void companyApi.listMembers().then(setMembers);
  }

  useEffect(refresh, []);

  async function changeRole(id: number, role: "OWNER" | "ADMIN" | "USER") {
    setError(null);
    setBusy(id);
    try {
      await companyApi.updateMemberRole(id, role);
      refresh();
    } catch (e) {
      setError((e as ApiError).message ?? "역할 변경 실패");
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: number) {
    if (!confirm("이 멤버를 회사에서 제거할까요?")) return;
    setError(null);
    setBusy(id);
    try {
      await companyApi.removeMember(id);
      refresh();
    } catch (e) {
      setError((e as ApiError).message ?? "제거 실패");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="rounded-md border p-4">
      <h2 className="text-xl font-semibold">멤버 ({members.length})</h2>
      {error ? <p className="mt-2 text-sm text-(--color-error)">{error}</p> : null}
      <ul className="mt-3 divide-y">
        {members.map((m) => (
          <li key={m.id} className="flex flex-wrap items-center gap-3 py-2 text-sm">
            <div className="flex-1">
              <div className="font-medium">
                {m.fullName ?? m.username}
                {m.id === currentUserId ? (
                  <span className="ml-2 text-xs text-(--color-muted-foreground)">(나)</span>
                ) : null}
              </div>
              <div className="text-(--color-muted-foreground)">{m.email}</div>
            </div>
            {canManage && m.id !== currentUserId ? (
              <select
                className="rounded-(--radius) border bg-(--color-background) px-2 py-1"
                value={m.companyRole}
                disabled={busy === m.id}
                onChange={(e) => changeRole(m.id, e.target.value as "OWNER" | "ADMIN" | "USER")}
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            ) : (
              <span className="rounded-md bg-(--color-muted) px-2 py-1">{m.companyRole}</span>
            )}
            {canManage && m.id !== currentUserId ? (
              <Button variant="ghost" disabled={busy === m.id} onClick={() => remove(m.id)}>
                제거
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
