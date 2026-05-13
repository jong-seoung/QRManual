import Link from "next/link";

import { Button } from "@/components/ui/button";
import { manualsApi } from "@/lib/api/manuals";

export const metadata = { title: "설명서 검색 — QRManual" };

export default async function PublicManualsPage({
  searchParams,
}: {
  searchParams: Promise<{ keyword?: string; page?: string }>;
}) {
  const params = await searchParams;
  const keyword = params.keyword;
  const page = Math.max(0, Number(params.page ?? 0));
  const size = 24;

  const result = await manualsApi.publicList({ keyword, page, size });

  return (
    <main className="mx-auto max-w-screen-xl space-y-6 py-8">
      <header>
        <h1 className="text-3xl font-bold">설명서 검색</h1>
        <p className="mt-1 text-sm text-(--color-muted-foreground)">
          매뉴얼을 선택하면 사용설명서를 볼 수 있습니다 · {result.total}개
        </p>
      </header>

      <form className="flex gap-2" action="/manuals">
        <input
          name="keyword"
          defaultValue={keyword ?? ""}
          placeholder="매뉴얼 이름으로 검색"
          className="h-11 flex-1 rounded-(--radius) border bg-(--color-background) px-3"
        />
        <Button type="submit" variant="secondary">
          검색
        </Button>
      </form>

      {result.items.length === 0 ? (
        <p className="rounded-md border p-8 text-center text-(--color-muted-foreground)">
          {keyword ? "검색 결과 없음" : "등록된 매뉴얼이 없습니다"}
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {result.items.map((m) => (
            <li key={m.id}>
              <Link
                href={`/p/${m.id}`}
                className="block rounded-(--radius) border p-4 transition hover:border-(--color-primary) hover:bg-(--color-muted)"
              >
                {m.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.imageUrl}
                    alt={m.name}
                    className="mb-2 h-32 w-full rounded object-cover"
                  />
                ) : (
                  <div className="mb-2 flex h-32 items-center justify-center rounded bg-(--color-muted) text-(--color-muted-foreground)">
                    이미지 없음
                  </div>
                )}
                <div className="font-semibold">{m.name}</div>
                <div className="mt-1 text-xs text-(--color-muted-foreground)">
                  {m.modelCode ?? "—"}
                  {m.releaseYear ? ` · ${m.releaseYear}` : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Pagination page={page} size={size} total={result.total} keyword={keyword} />
    </main>
  );
}

function Pagination({
  page,
  size,
  total,
  keyword,
}: {
  page: number;
  size: number;
  total: number;
  keyword?: string;
}) {
  const lastPage = Math.max(0, Math.ceil(total / size) - 1);
  if (lastPage === 0) return null;
  const buildHref = (p: number) => {
    const sp = new URLSearchParams();
    sp.set("page", String(p));
    if (keyword) sp.set("keyword", keyword);
    return `/manuals?${sp.toString()}`;
  };
  return (
    <nav className="flex items-center justify-center gap-2 pt-4 text-sm">
      <Link
        href={buildHref(Math.max(0, page - 1))}
        className={`rounded border px-3 py-1 ${page === 0 ? "pointer-events-none opacity-50" : "hover:bg-(--color-muted)"}`}
      >
        이전
      </Link>
      <span className="text-(--color-muted-foreground)">
        {page + 1} / {lastPage + 1}
      </span>
      <Link
        href={buildHref(Math.min(lastPage, page + 1))}
        className={`rounded border px-3 py-1 ${page === lastPage ? "pointer-events-none opacity-50" : "hover:bg-(--color-muted)"}`}
      >
        다음
      </Link>
    </nav>
  );
}
