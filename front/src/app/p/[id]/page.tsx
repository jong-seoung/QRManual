import { notFound } from "next/navigation";

import { BookmarkButton } from "@/components/bookmark-button";
import { type ApiError } from "@/lib/api/client";
import { manualsApi } from "@/lib/api/manuals";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  try {
    const data = await manualsApi.publicDetail(Number(id));
    return {
      title: `${data.manual.name} — ${data.company.name}`,
      description: data.manual.modelCode ? `Model ${data.manual.modelCode}` : data.company.name,
      openGraph: {
        title: data.manual.name,
        description: data.company.name,
        images: data.manual.imageUrl ? [{ url: data.manual.imageUrl }] : undefined,
      },
    };
  } catch {
    return { title: "QRManual" };
  }
}

export default async function PublicManualPage({ params }: PageProps) {
  const { id } = await params;
  const manualId = Number(id);
  if (!Number.isFinite(manualId)) notFound();

  let data;
  try {
    data = await manualsApi.publicDetail(manualId);
  } catch (e) {
    if ((e as ApiError).status === 404) notFound();
    throw e;
  }

  const { manual, company, pdfs, parts, faqs, customerService } = data;
  const pdfsByLang = groupBy(pdfs, (p) => p.language);

  return (
    <main className="space-y-6 py-8">
      {/* 회사 헤더 */}
      <header className="flex items-center gap-2 text-sm text-(--color-muted-foreground)">
        {company.homePage ? (
          <a href={company.homePage} target="_blank" rel="noreferrer" className="hover:underline">
            {company.name}
          </a>
        ) : (
          <span>{company.name}</span>
        )}
        {company.officialMark ? (
          <span
            title="공식 인증"
            className="inline-flex items-center rounded-full bg-(--color-primary) px-2 py-0.5 text-xs font-medium text-(--color-primary-foreground)"
          >
            공식
          </span>
        ) : null}
      </header>

      {/* 매뉴얼 헤더 */}
      <section className="mt-3">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{manual.name}</h1>
        <div className="mt-1 flex flex-wrap gap-2 text-sm text-(--color-muted-foreground)">
          {manual.modelCode ? <span>모델 {manual.modelCode}</span> : null}
          {manual.releaseYear ? <span>· {manual.releaseYear}</span> : null}
        </div>

        {manual.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={manual.imageUrl}
            alt={manual.name}
            className="mt-4 w-full rounded-(--radius) border object-cover"
          />
        ) : null}
      </section>

      {/* PDF — QR 진입의 핵심 */}
      <section className="mt-6 space-y-3">
        <h2 className="text-xl font-semibold">사용설명서</h2>
        {pdfs.length === 0 ? (
          <p className="rounded-md border bg-(--color-muted) p-6 text-center text-sm text-(--color-muted-foreground)">
            등록된 매뉴얼이 없습니다
          </p>
        ) : (
          Object.entries(pdfsByLang).map(([lang, items]) => (
            <div key={lang} className="rounded-(--radius) border">
              <div className="border-b bg-(--color-muted) px-3 py-2 text-xs font-medium uppercase tracking-wide">
                {lang}
              </div>
              <ul className="divide-y">
                {items.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                    <a
                      href={p.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-1 items-center justify-between gap-3 hover:underline"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{p.title ?? p.originFileName ?? "매뉴얼"}</div>
                        <div className="text-xs text-(--color-muted-foreground)">
                          PDF
                          {p.fileSize ? ` · ${formatSize(p.fileSize)}` : null}
                        </div>
                      </div>
                      <span className="text-(--color-primary)">열기 →</span>
                    </a>
                    <BookmarkButton manualPdfId={p.id} redirect={`/p/${manual.id}`} size="sm" />
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>

      {/* 부품 */}
      {parts.length > 0 ? (
        <section className="mt-6 space-y-3">
          <h2 className="text-xl font-semibold">부품</h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {parts.map((p) => (
              <li key={p.id} className="rounded-(--radius) border p-3">
                <div className="flex items-start gap-3">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt={p.name} className="h-16 w-16 rounded object-cover" />
                  ) : null}
                  <div className="flex-1 text-sm">
                    <div className="font-medium">{p.name}</div>
                    {p.storeLink ? (
                      <a
                        href={p.storeLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-(--color-primary) hover:underline"
                      >
                        구매 →
                      </a>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* FAQ — details/summary로 접기 */}
      {faqs.length > 0 ? (
        <section className="mt-6 space-y-2">
          <h2 className="text-xl font-semibold">자주 묻는 질문</h2>
          <div className="divide-y rounded-(--radius) border">
            {faqs.map((f) => (
              <details key={f.id} className="group">
                <summary className="cursor-pointer list-none p-3 text-sm font-medium hover:bg-(--color-muted)">
                  <span className="mr-2 inline-block transition group-open:rotate-90">▸</span>
                  {f.question}
                </summary>
                <div className="whitespace-pre-line border-t bg-(--color-muted) p-3 text-sm">
                  {f.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {/* 고객센터 */}
      {customerService ? (
        <section className="mt-6 space-y-2 rounded-(--radius) border p-4 text-sm">
          <h2 className="text-base font-semibold">고객센터</h2>
          {customerService.phone ? (
            <div>
              <span className="text-(--color-muted-foreground)">전화: </span>
              <a href={`tel:${customerService.phone}`} className="text-(--color-primary) hover:underline">
                {customerService.phone}
              </a>
            </div>
          ) : null}
          {customerService.email ? (
            <div>
              <span className="text-(--color-muted-foreground)">이메일: </span>
              <a href={`mailto:${customerService.email}`} className="text-(--color-primary) hover:underline">
                {customerService.email}
              </a>
            </div>
          ) : null}
          {customerService.operationTime ? (
            <div>
              <span className="text-(--color-muted-foreground)">운영시간: </span>
              <span>{customerService.operationTime}</span>
            </div>
          ) : null}
          {customerService.chatLink ? (
            <div>
              <a
                href={customerService.chatLink}
                target="_blank"
                rel="noreferrer"
                className="text-(--color-primary) hover:underline"
              >
                채팅 상담 →
              </a>
            </div>
          ) : null}
        </section>
      ) : null}

      {/* 부가 정보 */}
      {manual.serialNumberLocation || manual.productPage || manual.publicStoreLink ? (
        <section className="mt-6 space-y-2 rounded-(--radius) border p-4 text-sm">
          {manual.serialNumberLocation ? (
            <div>
              <span className="text-(--color-muted-foreground)">시리얼 위치: </span>
              <span>{manual.serialNumberLocation}</span>
            </div>
          ) : null}
          {manual.productPage ? (
            <div>
              <a
                href={manual.productPage}
                target="_blank"
                rel="noreferrer"
                className="text-(--color-primary) hover:underline"
              >
                제품 페이지 →
              </a>
            </div>
          ) : null}
          {manual.publicStoreLink ? (
            <div>
              <a
                href={manual.publicStoreLink}
                target="_blank"
                rel="noreferrer"
                className="text-(--color-primary) hover:underline"
              >
                구매 →
              </a>
            </div>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}

function groupBy<T, K extends string | number>(arr: T[], key: (item: T) => K): Record<K, T[]> {
  const out = {} as Record<K, T[]>;
  for (const item of arr) {
    const k = key(item);
    (out[k] ??= []).push(item);
  }
  return out;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
