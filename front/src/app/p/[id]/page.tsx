import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

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
  const t = await getTranslations("publicManual");
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
    <main>
      <Hero
        manual={manual}
        company={company}
        officialLabel={t("official")}
        modelLabel={manual.modelCode ? t("model", { code: manual.modelCode }) : null}
        yearLabel={manual.releaseYear ? t("year", { year: manual.releaseYear }) : null}
      />

      <PdfSection
        title={t("sections.pdfs")}
        emptyLabel={t("emptyPdfs")}
        openLabel={t("openPdf")}
        pdfsByLang={pdfsByLang}
        manualId={manual.id}
      />

      {parts.length > 0 ? (
        <PartsSection title={t("sections.parts")} buyLabel={t("parts.buy")} parts={parts} />
      ) : null}

      {faqs.length > 0 ? <FaqSection title={t("sections.faqs")} faqs={faqs} /> : null}

      {customerService ? (
        <CustomerServiceSection
          title={t("sections.customerService")}
          phoneLabel={t("cs.phone")}
          emailLabel={t("cs.email")}
          hoursLabel={t("cs.hours")}
          chatLabel={t("cs.chat")}
          cs={customerService}
        />
      ) : null}

      {manual.serialNumberLocation || manual.productPage || manual.publicStoreLink ? (
        <ExtrasSection
          title={t("sections.extras")}
          serialLabel={t("extras.serialLocation")}
          productPageLabel={t("extras.productPage")}
          storeLabel={t("extras.store")}
          manual={manual}
        />
      ) : null}

      <FooterActions homeLabel={t("actions.home")} searchLabel={t("actions.search")} />
    </main>
  );
}

type ManualHeader = {
  id: number;
  name: string;
  imageUrl: string | null;
  modelCode: string | null;
  releaseYear: number | null;
  serialNumberLocation: string | null;
  productPage: string | null;
  publicStoreLink: string | null;
};
type CompanyHeader = { id: number; name: string; officialMark: boolean; homePage: string | null };
type PdfRow = {
  id: number;
  manualId: number;
  language: string;
  title: string | null;
  pdfUrl: string;
  originFileName: string | null;
  mimeType: string | null;
  fileSize: number | null;
  createdAt: string;
};
type PartRow = { id: number; manualId: number; name: string; imageUrl: string | null; storeLink: string | null };
type FaqRow = { id: number; manualId: number; question: string; answer: string };
type CsRow = {
  id: number;
  manualId: number;
  phone: string | null;
  email: string | null;
  operationTime: string | null;
  chatLink: string | null;
};

function Hero({
  manual,
  company,
  officialLabel,
  modelLabel,
  yearLabel,
}: {
  manual: ManualHeader;
  company: CompanyHeader;
  officialLabel: string;
  modelLabel: string | null;
  yearLabel: string | null;
}) {
  return (
    <section className="py-12 lg:py-16">
      <div className="flex items-center gap-2 text-sm">
        {company.homePage ? (
          <a
            href={company.homePage}
            target="_blank"
            rel="noreferrer"
            className="text-(--color-muted-foreground) hover:text-(--color-primary) hover:underline"
          >
            {company.name}
          </a>
        ) : (
          <span className="text-(--color-muted-foreground)">{company.name}</span>
        )}
        {company.officialMark ? (
          <span className="inline-flex rounded-(--radius-utility) bg-(--color-primary) px-2 py-0.5 text-xs font-semibold text-(--color-primary-foreground)">
            {officialLabel}
          </span>
        ) : null}
      </div>

      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-(--color-foreground) lg:text-6xl">
        {manual.name}
      </h1>
      {modelLabel || yearLabel ? (
        <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-(--color-muted-foreground)">
          {modelLabel ? <span>{modelLabel}</span> : null}
          {yearLabel ? <span>{yearLabel}</span> : null}
        </p>
      ) : null}

      {manual.imageUrl ? (
        <div className="mt-8 overflow-hidden rounded-(--radius-card) border border-(--color-border) bg-(--color-surface-tile)">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={manual.imageUrl}
            alt={manual.name}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      ) : null}
    </section>
  );
}

function PdfSection({
  title,
  emptyLabel,
  openLabel,
  pdfsByLang,
  manualId,
}: {
  title: string;
  emptyLabel: string;
  openLabel: string;
  pdfsByLang: Record<string, PdfRow[]>;
  manualId: number;
}) {
  const langs = Object.keys(pdfsByLang);
  return (
    <section className="border-t border-(--color-divider-soft) bg-(--color-canvas-parchment) py-12 lg:py-16">
      <h2 className="text-2xl font-semibold tracking-tight text-(--color-foreground) lg:text-3xl">
        {title}
      </h2>

      {langs.length === 0 ? (
        <p className="mt-6 rounded-(--radius-card) border border-(--color-border) bg-(--color-background) px-6 py-12 text-center text-sm text-(--color-muted-foreground)">
          {emptyLabel}
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {langs.map((lang) => (
            <div
              key={lang}
              className="overflow-hidden rounded-(--radius-card) border border-(--color-border) bg-(--color-background)"
            >
              <div className="flex items-center gap-2 border-b border-(--color-divider-soft) bg-(--color-canvas-parchment) px-4 py-2.5">
                <span className="rounded-(--radius-utility) bg-(--color-background) px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-(--color-primary)">
                  {lang}
                </span>
              </div>
              <ul className="divide-y divide-(--color-divider-soft)">
                {pdfsByLang[lang].map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-4 px-4 py-3"
                  >
                    <a
                      href={p.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-1 items-center gap-3 text-sm"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-(--radius-utility) bg-(--color-canvas-parchment) text-xs font-semibold text-(--color-primary)">
                        PDF
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-(--color-foreground)">
                          {p.title ?? p.originFileName ?? title}
                        </div>
                        <div className="text-xs text-(--color-muted-foreground)">
                          {p.fileSize ? formatSize(p.fileSize) : "PDF"}
                        </div>
                      </div>
                      <span className="hidden text-sm font-medium text-(--color-primary) sm:inline">
                        {openLabel} →
                      </span>
                    </a>
                    <BookmarkButton manualPdfId={p.id} redirect={`/p/${manualId}`} size="sm" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function PartsSection({
  title,
  buyLabel,
  parts,
}: {
  title: string;
  buyLabel: string;
  parts: PartRow[];
}) {
  return (
    <section className="border-t border-(--color-divider-soft) py-12 lg:py-16">
      <h2 className="text-2xl font-semibold tracking-tight text-(--color-foreground) lg:text-3xl">
        {title}
      </h2>
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {parts.map((p) => (
          <li
            key={p.id}
            className="flex items-start gap-3 rounded-(--radius-card) border border-(--color-border) bg-(--color-background) p-4"
          >
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-(--radius-utility) bg-(--color-surface-tile)">
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1 text-sm">
              <div className="line-clamp-2 font-medium text-(--color-foreground)">{p.name}</div>
              {p.storeLink ? (
                <a
                  href={p.storeLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex text-(--color-primary) hover:underline"
                >
                  {buyLabel} →
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FaqSection({ title, faqs }: { title: string; faqs: FaqRow[] }) {
  return (
    <section className="border-t border-(--color-divider-soft) bg-(--color-canvas-parchment) py-12 lg:py-16">
      <h2 className="text-2xl font-semibold tracking-tight text-(--color-foreground) lg:text-3xl">
        {title}
      </h2>
      <div className="mt-6 overflow-hidden rounded-(--radius-card) border border-(--color-border) bg-(--color-background)">
        {faqs.map((f, i) => (
          <details
            key={f.id}
            className={`group ${i > 0 ? "border-t border-(--color-divider-soft)" : ""}`}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-(--color-foreground) hover:bg-(--color-canvas-parchment)">
              <span>{f.question}</span>
              <span
                aria-hidden
                className="text-(--color-muted-foreground) transition group-open:rotate-180"
              >
                ▾
              </span>
            </summary>
            <div className="whitespace-pre-line border-t border-(--color-divider-soft) bg-(--color-canvas-parchment) px-5 py-4 text-sm text-(--color-ink-muted-80)">
              {f.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function CustomerServiceSection({
  title,
  phoneLabel,
  emailLabel,
  hoursLabel,
  chatLabel,
  cs,
}: {
  title: string;
  phoneLabel: string;
  emailLabel: string;
  hoursLabel: string;
  chatLabel: string;
  cs: CsRow;
}) {
  const rows: { label: string; value: React.ReactNode }[] = [];
  if (cs.phone)
    rows.push({
      label: phoneLabel,
      value: (
        <a href={`tel:${cs.phone}`} className="text-(--color-primary) hover:underline">
          {cs.phone}
        </a>
      ),
    });
  if (cs.email)
    rows.push({
      label: emailLabel,
      value: (
        <a href={`mailto:${cs.email}`} className="text-(--color-primary) hover:underline">
          {cs.email}
        </a>
      ),
    });
  if (cs.operationTime) rows.push({ label: hoursLabel, value: cs.operationTime });
  if (cs.chatLink)
    rows.push({
      label: chatLabel,
      value: (
        <a
          href={cs.chatLink}
          target="_blank"
          rel="noreferrer"
          className="text-(--color-primary) hover:underline"
        >
          {chatLabel} →
        </a>
      ),
    });

  return (
    <section className="border-t border-(--color-divider-soft) py-12 lg:py-16">
      <h2 className="text-2xl font-semibold tracking-tight text-(--color-foreground) lg:text-3xl">
        {title}
      </h2>
      <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {rows.map((row, i) => (
          <div
            key={i}
            className="rounded-(--radius-card) border border-(--color-border) bg-(--color-background) px-5 py-4"
          >
            <dt className="text-xs uppercase tracking-wide text-(--color-muted-foreground)">
              {row.label}
            </dt>
            <dd className="mt-1 text-sm text-(--color-foreground)">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ExtrasSection({
  title,
  serialLabel,
  productPageLabel,
  storeLabel,
  manual,
}: {
  title: string;
  serialLabel: string;
  productPageLabel: string;
  storeLabel: string;
  manual: ManualHeader;
}) {
  return (
    <section className="border-t border-(--color-divider-soft) bg-(--color-canvas-parchment) py-12 lg:py-16">
      <h2 className="text-2xl font-semibold tracking-tight text-(--color-foreground) lg:text-3xl">
        {title}
      </h2>
      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {manual.serialNumberLocation ? (
          <li className="rounded-(--radius-card) border border-(--color-border) bg-(--color-background) px-5 py-4">
            <div className="text-xs uppercase tracking-wide text-(--color-muted-foreground)">
              {serialLabel}
            </div>
            <div className="mt-1 text-sm text-(--color-foreground)">
              {manual.serialNumberLocation}
            </div>
          </li>
        ) : null}
        {manual.productPage ? (
          <li className="rounded-(--radius-card) border border-(--color-border) bg-(--color-background) px-5 py-4">
            <a
              href={manual.productPage}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <div className="text-xs uppercase tracking-wide text-(--color-muted-foreground)">
                {productPageLabel}
              </div>
              <div className="mt-1 text-sm text-(--color-primary) hover:underline">
                {manual.productPage.replace(/^https?:\/\//, "").replace(/\/.*$/, "")} →
              </div>
            </a>
          </li>
        ) : null}
        {manual.publicStoreLink ? (
          <li className="rounded-(--radius-card) border border-(--color-border) bg-(--color-background) px-5 py-4">
            <a
              href={manual.publicStoreLink}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <div className="text-xs uppercase tracking-wide text-(--color-muted-foreground)">
                {storeLabel}
              </div>
              <div className="mt-1 text-sm text-(--color-primary) hover:underline">
                {storeLabel} →
              </div>
            </a>
          </li>
        ) : null}
      </ul>
    </section>
  );
}

function FooterActions({ homeLabel, searchLabel }: { homeLabel: string; searchLabel: string }) {
  return (
    <section className="border-t border-(--color-divider-soft) py-10 text-center">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/manuals"
          className="rounded-(--radius) border border-(--color-border-strong) px-5 py-2.5 text-sm font-medium text-(--color-ink) hover:bg-(--color-muted)"
        >
          {searchLabel}
        </Link>
        <Link
          href="/"
          className="rounded-(--radius) bg-(--color-primary) px-5 py-2.5 text-sm font-medium text-(--color-primary-foreground) hover:opacity-90"
        >
          {homeLabel}
        </Link>
      </div>
    </section>
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
