"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import type { ApiError } from "@/lib/api/client";
import { customerServiceApi, faqsApi, partsApi } from "@/lib/api/manual-extras";
import { manualPdfsApi } from "@/lib/api/manual-pdfs";
import { manualsApi } from "@/lib/api/manuals";

interface GeneralInfo {
  name: string;
  imageUrl: string;
  modelCode: string;
  releaseYear: string;
  serialNumberLocation: string;
  productPage: string;
  publicStoreLink: string;
}

interface PdfDraft {
  language: string;
  title: string;
  file: File | null;
}

interface PartDraft {
  name: string;
  imageUrl: string;
  storeLink: string;
}

interface FaqDraft {
  question: string;
  answer: string;
}

interface CustomerServiceDraft {
  phone: string;
  email: string;
  operationTime: string;
  chatLink: string;
}

const EMPTY_GENERAL: GeneralInfo = {
  name: "",
  imageUrl: "",
  modelCode: "",
  releaseYear: "",
  serialNumberLocation: "",
  productPage: "",
  publicStoreLink: "",
};

const EMPTY_PDF: PdfDraft = { language: "ko", title: "", file: null };
const EMPTY_PART: PartDraft = { name: "", imageUrl: "", storeLink: "" };
const EMPTY_FAQ: FaqDraft = { question: "", answer: "" };
const EMPTY_CS: CustomerServiceDraft = {
  phone: "",
  email: "",
  operationTime: "",
  chatLink: "",
};

export function ManualCreateForm() {
  const router = useRouter();

  const [general, setGeneral] = useState<GeneralInfo>(EMPTY_GENERAL);
  const [pdfs, setPdfs] = useState<PdfDraft[]>([]);
  const [parts, setParts] = useState<PartDraft[]>([]);
  const [faqs, setFaqs] = useState<FaqDraft[]>([]);
  const [cs, setCs] = useState<CustomerServiceDraft>(EMPTY_CS);

  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  function setGeneralField<K extends keyof GeneralInfo>(key: K, value: GeneralInfo[K]) {
    setGeneral((g) => ({ ...g, [key]: value }));
  }

  function setCsField<K extends keyof CustomerServiceDraft>(key: K, value: CustomerServiceDraft[K]) {
    setCs((s) => ({ ...s, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    if (!general.name.trim()) {
      setError("매뉴얼 이름을 입력해주세요");
      return;
    }

    setError(null);
    setWarnings([]);
    setSubmitting(true);

    try {
      setProgress("매뉴얼 생성 중…");
      const created = await manualsApi.create({
        name: general.name.trim(),
        imageUrl: general.imageUrl.trim() || undefined,
        modelCode: general.modelCode.trim() || undefined,
        releaseYear: general.releaseYear ? Number(general.releaseYear) : undefined,
        serialNumberLocation: general.serialNumberLocation.trim() || undefined,
        productPage: general.productPage.trim() || undefined,
        publicStoreLink: general.publicStoreLink.trim() || undefined,
      });

      const collectedWarnings: string[] = [];

      // PDF 업로드 (멀티파트, 순차)
      const validPdfs = pdfs.filter((p) => p.file && p.language.trim());
      for (let i = 0; i < validPdfs.length; i++) {
        const pdf = validPdfs[i];
        setProgress(`PDF 업로드 중 (${i + 1}/${validPdfs.length})…`);
        try {
          await manualPdfsApi.upload(
            created.id,
            pdf.file as File,
            pdf.language.trim(),
            pdf.title.trim() || undefined,
          );
        } catch (e) {
          collectedWarnings.push(
            `PDF "${pdf.title || (pdf.file as File).name}" 업로드 실패: ${(e as ApiError).message ?? "알 수 없는 오류"}`,
          );
        }
      }

      // Parts
      const validParts = parts.filter((p) => p.name.trim());
      for (let i = 0; i < validParts.length; i++) {
        const part = validParts[i];
        setProgress(`부품 등록 중 (${i + 1}/${validParts.length})…`);
        try {
          await partsApi.create(created.id, {
            name: part.name.trim(),
            imageUrl: part.imageUrl.trim() || undefined,
            storeLink: part.storeLink.trim() || undefined,
          });
        } catch (e) {
          collectedWarnings.push(
            `부품 "${part.name}" 등록 실패: ${(e as ApiError).message ?? "알 수 없는 오류"}`,
          );
        }
      }

      // FAQs
      const validFaqs = faqs.filter((f) => f.question.trim() && f.answer.trim());
      for (let i = 0; i < validFaqs.length; i++) {
        const faq = validFaqs[i];
        setProgress(`FAQ 등록 중 (${i + 1}/${validFaqs.length})…`);
        try {
          await faqsApi.create(created.id, {
            question: faq.question.trim(),
            answer: faq.answer.trim(),
          });
        } catch (e) {
          collectedWarnings.push(
            `FAQ "${faq.question.slice(0, 20)}…" 등록 실패: ${(e as ApiError).message ?? "알 수 없는 오류"}`,
          );
        }
      }

      // Customer Service (1:1, 한 필드라도 있으면 upsert)
      const csHasValue = Object.values(cs).some((v) => v.trim());
      if (csHasValue) {
        setProgress("고객센터 정보 저장 중…");
        try {
          await customerServiceApi.upsert(created.id, {
            phone: cs.phone.trim() || undefined,
            email: cs.email.trim() || undefined,
            operationTime: cs.operationTime.trim() || undefined,
            chatLink: cs.chatLink.trim() || undefined,
          });
        } catch (e) {
          collectedWarnings.push(
            `고객센터 정보 저장 실패: ${(e as ApiError).message ?? "알 수 없는 오류"}`,
          );
        }
      }

      if (collectedWarnings.length > 0) {
        setWarnings(collectedWarnings);
        setProgress(null);
        setSubmitting(false);
        setTimeout(() => router.push(`/admin/manuals/${created.id}`), 3500);
        return;
      }

      router.push(`/admin/manuals/${created.id}`);
    } catch (e) {
      setError((e as ApiError).message ?? "매뉴얼 생성 실패");
      setProgress(null);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 기본 정보 — 이미지(왼쪽) + 이름·모델·연도(오른쪽) */}
      <section className="space-y-6 rounded-[14px] border border-(--color-hairline) bg-(--color-background) p-7">
        <header>
          <h2 className="text-[28px] font-semibold leading-[1.14] tracking-[-0.003em] text-(--color-ink)">기본 정보</h2>
        </header>

        <div className="grid gap-4 md:grid-cols-[160px_1fr]">
          <Field label="대표 이미지" htmlFor="imageUrl">
            <ImageUpload
              id="imageUrl"
              value={general.imageUrl}
              onChange={(url) => setGeneralField("imageUrl", url)}
              dir="manual-images"
              size={160}
              layout="stacked"
            />
          </Field>

          <div className="space-y-4">
            <Field label="매뉴얼 이름" htmlFor="name">
              <Input
                id="name"
                required
                value={general.name}
                onChange={(e) => setGeneralField("name", e.target.value)}
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="모델 코드" htmlFor="modelCode">
                <Input
                  id="modelCode"
                  value={general.modelCode}
                  onChange={(e) => setGeneralField("modelCode", e.target.value)}
                />
              </Field>
              <Field label="출시 연도" htmlFor="releaseYear">
                <Input
                  id="releaseYear"
                  type="number"
                  min={1900}
                  max={2100}
                  value={general.releaseYear}
                  onChange={(e) => setGeneralField("releaseYear", e.target.value)}
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="시리얼 번호 위치" htmlFor="serialNumberLocation">
            <Input
              id="serialNumberLocation"
              placeholder="예: 본체 하단"
              value={general.serialNumberLocation}
              onChange={(e) => setGeneralField("serialNumberLocation", e.target.value)}
            />
          </Field>
          <Field label="제품 페이지 URL" htmlFor="productPage">
            <Input
              id="productPage"
              type="url"
              placeholder="https://…"
              value={general.productPage}
              onChange={(e) => setGeneralField("productPage", e.target.value)}
            />
          </Field>
        </div>

        <Field label="공식 스토어 링크" htmlFor="publicStoreLink">
          <Input
            id="publicStoreLink"
            type="url"
            placeholder="https://…"
            value={general.publicStoreLink}
            onChange={(e) => setGeneralField("publicStoreLink", e.target.value)}
          />
        </Field>
      </section>

      {/* 매뉴얼 PDF */}
      <section className="space-y-5 rounded-[14px] border border-(--color-hairline) bg-(--color-background) p-7">
        <div className="flex items-center justify-between">
          <h2 className="text-[28px] font-semibold leading-[1.14] tracking-[-0.003em] text-(--color-ink)">매뉴얼 PDF ({pdfs.length})</h2>
          <Button type="button" variant="secondary" onClick={() => setPdfs([...pdfs, { ...EMPTY_PDF }])}>
            + 추가
          </Button>
        </div>

        {pdfs.length === 0 ? (
          <p className="text-[15px] text-(--color-ink-muted-48)">PDF가 없습니다. 나중에 추가해도 됩니다.</p>
        ) : (
          <ul className="space-y-3">
            {pdfs.map((p, i) => (
              <li key={i} className="relative rounded-[10px] border border-(--color-hairline) bg-(--color-canvas-parchment) p-5 pr-12">
                <div className="grid gap-3 sm:grid-cols-[120px_1fr_minmax(220px,_1fr)]">
                  <Field label="언어" htmlFor={`pdf-lang-${i}`}>
                    <Input
                      id={`pdf-lang-${i}`}
                      placeholder="ko"
                      value={p.language}
                      onChange={(e) => updateAt(pdfs, setPdfs, i, { language: e.target.value })}
                    />
                  </Field>
                  <Field label="제목 (선택)" htmlFor={`pdf-title-${i}`}>
                    <Input
                      id={`pdf-title-${i}`}
                      placeholder="사용자 매뉴얼"
                      value={p.title}
                      onChange={(e) => updateAt(pdfs, setPdfs, i, { title: e.target.value })}
                    />
                  </Field>
                  <Field label="PDF 파일" htmlFor={`pdf-file-${i}`}>
                    <input
                      id={`pdf-file-${i}`}
                      type="file"
                      accept="application/pdf"
                      className="block h-10 w-full text-sm"
                      onChange={(e) => updateAt(pdfs, setPdfs, i, { file: e.target.files?.[0] ?? null })}
                    />
                  </Field>
                </div>
                <button
                  type="button"
                  onClick={() => removeAt(pdfs, setPdfs, i)}
                  aria-label="삭제"
                  className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-(--color-ink-muted-48) hover:bg-(--color-background) hover:text-(--color-error)"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 부품 — 이미지(왼쪽) + 이름·구매링크(오른쪽), 삭제는 오른쪽 상단 */}
      <section className="space-y-5 rounded-[14px] border border-(--color-hairline) bg-(--color-background) p-7">
        <div className="flex items-center justify-between">
          <h2 className="text-[28px] font-semibold leading-[1.14] tracking-[-0.003em] text-(--color-ink)">부품 ({parts.length})</h2>
          <Button type="button" variant="secondary" onClick={() => setParts([...parts, { ...EMPTY_PART }])}>
            + 추가
          </Button>
        </div>

        {parts.length === 0 ? (
          <p className="text-[15px] text-(--color-ink-muted-48)">등록된 부품 없음</p>
        ) : (
          <ul className="space-y-3">
            {parts.map((p, i) => (
              <li key={i} className="relative grid gap-5 rounded-[10px] border border-(--color-hairline) bg-(--color-canvas-parchment) p-5 pr-12 sm:grid-cols-[100px_1fr]">
                <ImageUpload
                  id={`part-image-${i}`}
                  value={p.imageUrl}
                  onChange={(url) => updateAt(parts, setParts, i, { imageUrl: url })}
                  dir="part-images"
                  size={100}
                  layout="stacked"
                />
                <div className="space-y-2">
                  <Field label="이름" htmlFor={`part-name-${i}`}>
                    <Input
                      id={`part-name-${i}`}
                      value={p.name}
                      onChange={(e) => updateAt(parts, setParts, i, { name: e.target.value })}
                    />
                  </Field>
                  <Field label="구매 링크 (선택)" htmlFor={`part-store-${i}`}>
                    <Input
                      id={`part-store-${i}`}
                      type="url"
                      placeholder="https://…"
                      value={p.storeLink}
                      onChange={(e) => updateAt(parts, setParts, i, { storeLink: e.target.value })}
                    />
                  </Field>
                </div>
                <button
                  type="button"
                  onClick={() => removeAt(parts, setParts, i)}
                  aria-label="삭제"
                  className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-(--color-ink-muted-48) hover:bg-(--color-background) hover:text-(--color-error)"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* FAQ */}
      <section className="space-y-5 rounded-[14px] border border-(--color-hairline) bg-(--color-background) p-7">
        <div className="flex items-center justify-between">
          <h2 className="text-[28px] font-semibold leading-[1.14] tracking-[-0.003em] text-(--color-ink)">FAQ ({faqs.length})</h2>
          <Button type="button" variant="secondary" onClick={() => setFaqs([...faqs, { ...EMPTY_FAQ }])}>
            + 추가
          </Button>
        </div>

        {faqs.length === 0 ? (
          <p className="text-[15px] text-(--color-ink-muted-48)">등록된 FAQ 없음</p>
        ) : (
          <ul className="space-y-3">
            {faqs.map((f, i) => (
              <li key={i} className="relative space-y-4 rounded-[10px] border border-(--color-hairline) bg-(--color-canvas-parchment) p-5 pr-12">
                <Field label="질문" htmlFor={`faq-q-${i}`}>
                  <Input
                    id={`faq-q-${i}`}
                    value={f.question}
                    onChange={(e) => updateAt(faqs, setFaqs, i, { question: e.target.value })}
                  />
                </Field>
                <Field label="답변" htmlFor={`faq-a-${i}`}>
                  <textarea
                    id={`faq-a-${i}`}
                    rows={3}
                    className="w-full rounded-[10px] border border-(--color-hairline) bg-(--color-background) px-4 py-3 text-[16px] text-(--color-ink) tracking-[-0.022em] outline-none placeholder:text-(--color-ink-muted-48) focus-visible:border-(--color-ink) focus-visible:outline-2 focus-visible:outline-(--color-ink) focus-visible:outline-offset-0"
                    value={f.answer}
                    onChange={(e) => updateAt(faqs, setFaqs, i, { answer: e.target.value })}
                  />
                </Field>
                <button
                  type="button"
                  onClick={() => removeAt(faqs, setFaqs, i)}
                  aria-label="삭제"
                  className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-(--color-ink-muted-48) hover:bg-(--color-background) hover:text-(--color-error)"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 고객센터 — 2x2 그리드 */}
      <section className="space-y-5 rounded-[14px] border border-(--color-hairline) bg-(--color-background) p-7">
        <h2 className="text-[28px] font-semibold leading-[1.14] tracking-[-0.003em] text-(--color-ink)">고객센터 (선택)</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="전화" htmlFor="cs-phone">
            <Input
              id="cs-phone"
              type="tel"
              value={cs.phone}
              onChange={(e) => setCsField("phone", e.target.value)}
            />
          </Field>
          <Field label="이메일" htmlFor="cs-email">
            <Input
              id="cs-email"
              type="email"
              value={cs.email}
              onChange={(e) => setCsField("email", e.target.value)}
            />
          </Field>
          <Field label="운영 시간" htmlFor="cs-time">
            <Input
              id="cs-time"
              placeholder="평일 09:00–18:00"
              value={cs.operationTime}
              onChange={(e) => setCsField("operationTime", e.target.value)}
            />
          </Field>
          <Field label="채팅 링크" htmlFor="cs-chat">
            <Input
              id="cs-chat"
              type="url"
              placeholder="https://…"
              value={cs.chatLink}
              onChange={(e) => setCsField("chatLink", e.target.value)}
            />
          </Field>
        </div>
      </section>

      {progress ? (
        <p className="rounded-[10px] border border-(--color-hairline) bg-(--color-canvas-parchment) p-4 text-[15px] text-(--color-ink-muted-80)">
          {progress}
        </p>
      ) : null}

      {warnings.length > 0 ? (
        <div className="rounded-[10px] border border-(--color-warning) bg-(--color-canvas-parchment) p-5 text-sm">
          <p className="text-base font-semibold text-(--color-ink)">매뉴얼은 생성됐지만 일부 항목 등록에 실패했습니다:</p>
          <ul className="mt-2 list-inside list-disc text-(--color-ink-muted-80)">
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-(--color-ink-muted-48)">잠시 후 수정 페이지로 이동합니다…</p>
        </div>
      ) : null}

      {error ? <p className="text-sm text-(--color-error)">{error}</p> : null}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={submitting}
          onClick={() => router.push("/admin/manuals")}
        >
          취소
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "저장 중…" : "생성"}
        </Button>
      </div>
    </form>
  );
}

function updateAt<T>(arr: T[], setArr: (next: T[]) => void, index: number, patch: Partial<T>): void {
  setArr(arr.map((item, i) => (i === index ? { ...item, ...patch } : item)));
}

function removeAt<T>(arr: T[], setArr: (next: T[]) => void, index: number): void {
  setArr(arr.filter((_, i) => i !== index));
}
