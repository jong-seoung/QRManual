"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ApiError } from "@/lib/api/client";
import { type Faq, faqsApi } from "@/lib/api/manual-extras";

interface FormValues {
  question: string;
  answer: string;
}

export function FaqsSection({ manualId }: { manualId: number }) {
  const [list, setList] = useState<Faq[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  const { register, handleSubmit, reset, formState } = useForm<FormValues>();

  function refresh() {
    void faqsApi.list(manualId).then(setList);
  }

  useEffect(refresh, [manualId]);

  async function onSubmit(values: FormValues) {
    setError(null);
    try {
      await faqsApi.create(manualId, values);
      reset({ question: "", answer: "" });
      refresh();
    } catch (e) {
      setError((e as ApiError).message ?? "추가 실패");
    }
  }

  async function remove(id: number) {
    if (!confirm("이 FAQ를 삭제할까요?")) return;
    setBusy(id);
    try {
      await faqsApi.remove(id);
      refresh();
    } catch (e) {
      setError((e as ApiError).message ?? "삭제 실패");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="space-y-4 rounded-md border p-4">
      <h2 className="text-xl font-semibold">FAQ ({list.length})</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded border bg-(--color-muted) p-3">
        <Field label="질문" htmlFor="faq-question">
          <Input id="faq-question" {...register("question", { required: true })} />
        </Field>
        <Field label="답변" htmlFor="faq-answer">
          <textarea
            id="faq-answer"
            rows={3}
            className="w-full rounded-(--radius) border bg-(--color-background) px-3 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)"
            {...register("answer", { required: true })}
          />
        </Field>
        <Button type="submit" disabled={formState.isSubmitting}>
          추가
        </Button>
      </form>

      {error ? <p className="text-sm text-(--color-error)">{error}</p> : null}

      {list.length === 0 ? (
        <p className="text-sm text-(--color-muted-foreground)">등록된 FAQ 없음</p>
      ) : (
        <ul className="divide-y">
          {list.map((f) => (
            <li key={f.id} className="flex items-start gap-3 py-3 text-sm">
              <div className="flex-1 space-y-1">
                <div className="font-medium">Q. {f.question}</div>
                <div className="whitespace-pre-line text-(--color-muted-foreground)">A. {f.answer}</div>
              </div>
              <Button variant="ghost" disabled={busy === f.id} onClick={() => remove(f.id)}>
                삭제
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
