import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { manualsApi, type Manual } from "@/lib/api/manuals";
import { getCurrentUser } from "@/lib/auth/server";

const FEATURE_TINTS = ["#dcecfa", "#d9f3e1", "#e6e0f5", "#ffe8d4"];
const FEATURE_ICONS = ["⚡", "🌐", "★", "↻"];

interface TrendingMessages {
  label: string;
  items: string[];
}

interface FeatureItem {
  title: string;
  body: string;
}

export default async function HomePage() {
  const t = await getTranslations("home");
  const user = await getCurrentUser();

  let manuals: Manual[] = [];
  try {
    const result = await manualsApi.publicList({ page: 0, size: 6 });
    manuals = result.items;
  } catch {
    manuals = [];
  }

  const trending = t.raw("trending") as TrendingMessages;
  const features = t.raw("features.items") as FeatureItem[];

  return (
    <main className="space-y-0">
      <Hero
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        searchPlaceholder={t("hero.searchPlaceholder")}
        searchSubmit={t("hero.searchSubmit")}
        ctaLabel={user ? t("hero.ctaUser") : t("hero.ctaGuest")}
        ctaHref={user ? "/me/bookmarks" : "/signup"}
        trending={trending}
      />
      <PopularGrid
        title={t("popular.title")}
        viewAll={t("popular.viewAll")}
        headerLinkLabel={user ? t("popular.headerLinkUser") : t("popular.headerLinkGuest")}
        headerLinkHref={user ? "/me/bookmarks" : "/login"}
        emptyLabel={t("popular.empty")}
        noImageLabel={t("popular.noImage")}
        categoryFallback={t("popular.categoryFallback")}
        manuals={manuals}
      />
      <Features title={t("features.title")} items={features} />
      <BottomCta
        title={t("bottomCta.title")}
        primaryLabel={user ? t("bottomCta.primaryUser") : t("bottomCta.primaryGuest")}
        primaryHref={user ? "/me/bookmarks" : "/signup"}
        secondaryLabel={user ? t("bottomCta.secondaryUser") : t("bottomCta.secondaryGuest")}
        secondaryHref={user ? "/manuals" : "/login"}
      />
    </main>
  );
}

function Hero({
  title,
  subtitle,
  searchPlaceholder,
  searchSubmit,
  ctaLabel,
  ctaHref,
  trending,
}: {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  searchSubmit: string;
  ctaLabel: string;
  ctaHref: string;
  trending: TrendingMessages;
}) {
  return (
    <section className="py-24 text-center lg:py-32">
      <h1 className="text-5xl font-semibold tracking-tight text-(--color-foreground) lg:text-7xl">
        {title}
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-(--color-muted-foreground)">
        {subtitle}
      </p>

      <form action="/manuals" className="mx-auto mt-10 flex max-w-2xl items-center gap-2">
        <input
          type="text"
          name="keyword"
          placeholder={searchPlaceholder}
          className="h-12 flex-1 rounded-(--radius) border border-(--color-border-strong) bg-(--color-background) px-4 text-base text-(--color-ink) outline-none placeholder:text-(--color-ink-muted-48) focus-visible:border-(--color-primary)"
        />
        <button
          type="submit"
          className="h-12 rounded-(--radius) bg-(--color-primary) px-5 text-sm font-medium text-(--color-primary-foreground) hover:opacity-90"
        >
          {searchSubmit}
        </button>
        <Link
          href={ctaHref}
          className="hidden h-12 items-center rounded-(--radius) border border-(--color-border-strong) px-5 text-sm font-medium text-(--color-ink) hover:bg-(--color-muted) sm:inline-flex"
        >
          {ctaLabel}
        </Link>
      </form>

      <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-2 text-sm">
        <span className="text-(--color-muted-foreground)">{trending.label}</span>
        {trending.items.map((item) => (
          <Link
            key={item}
            href={`/manuals?keyword=${encodeURIComponent(item)}`}
            className="rounded-full border border-(--color-hairline) px-3 py-1 text-(--color-ink-muted-80) hover:border-(--color-primary) hover:text-(--color-primary)"
          >
            {item}
          </Link>
        ))}
      </div>
    </section>
  );
}

function PopularGrid({
  title,
  viewAll,
  headerLinkLabel,
  headerLinkHref,
  emptyLabel,
  noImageLabel,
  categoryFallback,
  manuals,
}: {
  title: string;
  viewAll: string;
  headerLinkLabel: string;
  headerLinkHref: string;
  emptyLabel: string;
  noImageLabel: string;
  categoryFallback: string;
  manuals: Manual[];
}) {
  return (
    <section className="border-t border-(--color-divider-soft) bg-(--color-canvas-parchment) py-16 lg:py-24">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-(--color-foreground) lg:text-4xl">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link
            href={headerLinkHref}
            className="text-(--color-muted-foreground) hover:text-(--color-primary)"
          >
            {headerLinkLabel}
          </Link>
          <Link
            href="/manuals"
            className="text-(--color-primary) hover:underline"
          >
            {viewAll} →
          </Link>
        </div>
      </header>

      {manuals.length === 0 ? (
        <p className="mt-10 rounded-(--radius-card) border border-(--color-border) bg-(--color-background) py-16 text-center text-(--color-muted-foreground)">
          {emptyLabel}
        </p>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-3">
          {manuals.map((m) => (
            <li key={m.id}>
              <Link
                href={`/p/${m.id}`}
                className="block overflow-hidden rounded-(--radius-card) border border-(--color-border) bg-(--color-background) transition hover:border-(--color-primary)"
              >
                <div className="aspect-[16/10] w-full bg-(--color-surface-tile)">
                  {m.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.imageUrl}
                      alt={m.name}
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
                    {m.name}
                  </div>
                  <div className="text-xs text-(--color-muted-foreground)">
                    {m.modelCode ?? "—"}
                    {m.releaseYear ? ` · ${m.releaseYear}` : null}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Features({ title, items }: { title: string; items: FeatureItem[] }) {
  return (
    <section className="py-16 lg:py-24">
      <h2 className="text-center text-3xl font-semibold tracking-tight text-(--color-foreground) lg:text-4xl">
        {title}
      </h2>
      <ul className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((feature, i) => (
          <li
            key={i}
            style={{
              backgroundColor: FEATURE_TINTS[i],
              color: "#37352f",
            }}
            className="rounded-(--radius-card) p-8"
          >
            <div aria-hidden="true" className="text-3xl">
              {FEATURE_ICONS[i]}
            </div>
            <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed">{feature.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function BottomCta({
  title,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: {
  title: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}) {
  return (
    <section
      style={{ backgroundColor: "#0a1530", color: "#ffffff" }}
      className="py-24 text-center lg:py-32"
    >
      <h2 className="text-4xl font-semibold tracking-tight lg:text-5xl">{title}</h2>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={primaryHref}
          style={{ backgroundColor: "#5645d4", color: "#ffffff" }}
          className="rounded-(--radius) px-6 py-3 text-sm font-medium hover:opacity-90"
        >
          {primaryLabel}
        </Link>
        <Link
          href={secondaryHref}
          style={{ borderColor: "rgba(255,255,255,0.4)", color: "#ffffff" }}
          className="rounded-(--radius) border px-6 py-3 text-sm font-medium hover:bg-white/10"
        >
          {secondaryLabel}
        </Link>
      </div>
    </section>
  );
}
