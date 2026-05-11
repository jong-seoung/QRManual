// 헤더는 root layout이 렌더하므로 여기서는 폼 카드만.
export default function AuthSectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-(--color-muted) p-4">
      <div className="w-full max-w-md rounded-(--radius) border bg-(--color-background) p-6 shadow-sm md:p-8">
        {children}
      </div>
    </main>
  );
}
