import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { manualsApi, type Manual } from "@/lib/api/manuals";

export async function generateMetadata() {
  const t = await getTranslations("manualsList");
  return { title: t("metaTitle") };
}

export default async function PublicManualsPage({
  searchParams,
}: {
  searchParams: Promise<{ keyword?: string; page?: string }>;
}) {
  const t = await getTranslations("manualsList");
  const params = await searchParams;
  const keyword = params.keyword?.trim() || undefined;
  const page = Math.max(0, Number(params.page ?? 0));
  const size = 24;

  const result = await manualsApi.publicList({ keyword, page, size });
  const total = result.total;
  const lastPage = Math.max(0, Math.ceil(total / size) - 1);

  return (
    <main>
      <SearchHeader
        title={t("title")}
        subtitle={
          keyword
            ? t("subtitleWithKeyword", { keyword, total })
            : t("subtitle", { total })
        }
        placeholder={t("searchPlaceholder")}
        submitLabel={t("searchSubmit")}
        clearLabel={t("searchClear")}
        keyword={keyword}
      />

      <section className="border-t border-(--color-divider-soft) bg-(--color-canvas-parchment) py-12 lg:py-16">
        {result.items.length === 0 ? (
          <EmptyState
            keyword={keyword}
            title={
              keyword
                ? t("empty.withKeyword", { keyword })
                : t("empty.noKeyword")
            }
            hint={
              keyword ? t("empty.withKeywordHint") : t("empty.noKeywordHint")
            }
            clearLabel={t("empty.clearSearch")}
            backLabel={t("empty.backHome")}
          />
        ) : (
          <ul className="grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {result.items.map((m) => (
              <ManualCard
                key={m.id}
                manual={m}
                noImageLabel={t("noImage")}
                categoryFallback={t("categoryFallback")}
              />
            ))}
          </ul>
        )}

        {lastPage > 0 ? (
          <Pagination
            page={page}
            lastPage={lastPage}
            keyword={keyword}
            firstLabel={t("pagination.first")}
            prevLabel={t("pagination.prev")}
            nextLabel={t("pagination.next")}
            lastLabel={t("pagination.last")}
            summary={t("pagination.summary", {
              page: page + 1,
              total: lastPage + 1,
            })}
          />
        ) : null}
      </section>
    </main>
  );
}

function SearchHeader({
  title,
  subtitle,
  placeholder,
  submitLabel,
  clearLabel,
  keyword,
}: {
  title: string;
  subtitle: string;
  placeholder: string;
  submitLabel: string;
  clearLabel: string;
  keyword?: string;
}) {
  return (
    <section className="py-16 text-center lg:py-24">
      <h1 className="text-4xl font-semibold tracking-tight text-(--color-foreground) lg:text-6xl">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-base text-(--color-muted-foreground) lg:text-lg">
        {subtitle}
      </p>

      <form action="/manuals" className="mx-auto mt-10 flex max-w-2xl items-center gap-2">
        <input
          type="text"
          name="keyword"
          defaultValue={keyword ?? ""}
          placeholder={placeholder}
          className="h-12 flex-1 rounded-(--radius) border border-(--color-border-strong) bg-(--color-background) px-4 text-base text-(--color-ink) outline-none placeholder:text-(--color-ink-muted-48) focus-visible:border-(--color-primary)"
        />
        <button
          type="submit"
          className="h-12 rounded-(--radius) bg-(--color-primary) px-5 text-sm font-medium text-(--color-primary-foreground) hover:opacity-90"
        >
          {submitLabel}
        </button>
        {keyword ? (
          <Link
            href="/manuals"
            className="hidden h-12 items-center rounded-(--radius) border border-(--color-border-strong) px-5 text-sm font-medium text-(--color-ink) hover:bg-(--color-muted) sm:inline-flex"
          >
            {clearLabel}
          </Link>
        ) : null}
      </form>
    </section>
  );
}

function ManualCard({
  manual,
  noImageLabel,
  categoryFallback,
}: {
  manual: Manual;
  noImageLabel: string;
  categoryFallback: string;
}) {
  return (
    <li>
      <Link
        href={`/p/${manual.id}`}
        className="block overflow-hidden rounded-(--radius-card) border border-(--color-border) bg-(--color-background) transition hover:border-(--color-primary)"
      >
        <div className="aspect-[16/10] w-full bg-(--color-surface-tile)">
          {manual.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={manual.imageUrl}
              alt={manual.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-(--color-muted-foreground)">
              {noImageLabel}
            </div>
          )}
        </div>
        <div className="space-y-2 p-5">
          <span className="inline-flex rounded-(--radius-utility) bg-(--color-canvas-parchment) px-2 py-0.5 text-xs font-semibold text-(--color-primary)">
            {categoryFallback}
          </span>
          <div className="line-clamp-2 text-base font-semibold text-(--color-foreground)">
            {manual.name}
          </div>
          <div className="text-xs text-(--color-muted-foreground)">
            {manual.modelCode ?? "—"}
            {manual.releaseYear ? ` · ${manual.releaseYear}` : null}
          </div>
        </div>
      </Link>
    </li>
  );
}

function EmptyState({
  keyword,
  title,
  hint,
  clearLabel,
  backLabel,
}: {
  keyword?: string;
  title: string;
  hint: string;
  clearLabel: string;
  backLabel: string;
}) {
  return (
    <div className="rounded-(--radius-card) border border-(--color-border) bg-(--color-background) px-6 py-20 text-center">
      <p className="text-lg font-semibold text-(--color-foreground)">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-(--color-muted-foreground)">{hint}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {keyword ? (
          <Link
            href="/manuals"
            className="rounded-(--radius) bg-(--color-primary) px-5 py-2.5 text-sm font-medium text-(--color-primary-foreground) hover:opacity-90"
          >
            {clearLabel}
          </Link>
        ) : null}
        <Link
          href="/"
          className="rounded-(--radius) border border-(--color-border-strong) px-5 py-2.5 text-sm font-medium text-(--color-ink) hover:bg-(--color-muted)"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
}

function Pagination({
  page,
  lastPage,
  keyword,
  firstLabel,
  prevLabel,
  nextLabel,
  lastLabel,
  summary,
}: {
  page: number;
  lastPage: number;
  keyword?: string;
  firstLabel: string;
  prevLabel: string;
  nextLabel: string;
  lastLabel: string;
  summary: string;
}) {
  const buildHref = (p: number) => {
    const sp = new URLSearchParams();
    if (p > 0) sp.set("page", String(p));
    if (keyword) sp.set("keyword", keyword);
    const qs = sp.toString();
    return qs ? `/manuals?${qs}` : "/manuals";
  };

  const atFirst = page === 0;
  const atLast = page === lastPage;

  const baseBtn =
    "h-10 rounded-(--radius) border border-(--color-border-strong) px-4 text-sm font-medium text-(--color-ink) hover:bg-(--color-muted)";
  const disabled = "pointer-events-none opacity-40";

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm">
      <Link
        href={buildHref(0)}
        aria-disabled={atFirst}
        className={`${baseBtn} ${atFirst ? disabled : ""}`}
      >
        {firstLabel}
      </Link>
      <Link
        href={buildHref(Math.max(0, page - 1))}
        aria-disabled={atFirst}
        className={`${baseBtn} ${atFirst ? disabled : ""}`}
      >
        {prevLabel}
      </Link>
      <span className="px-3 text-(--color-muted-foreground)">{summary}</span>
      <Link
        href={buildHref(Math.min(lastPage, page + 1))}
        aria-disabled={atLast}
        className={`${baseBtn} ${atLast ? disabled : ""}`}
      >
        {nextLabel}
      </Link>
      <Link
        href={buildHref(lastPage)}
        aria-disabled={atLast}
        className={`${baseBtn} ${atLast ? disabled : ""}`}
      >
        {lastLabel}
      </Link>
    </nav>
  );
}
