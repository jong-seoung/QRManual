import Link from "next/link";

export const metadata = { title: "회원가입 — QRManual" };

export default function SignupChooserPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">회원가입</h1>
      <p className="text-sm text-(--color-muted-foreground)">
        어떤 계정으로 가입하시겠어요?
      </p>

      <div className="space-y-3">
        <Link
          href="/signup/personal"
          className="block rounded-(--radius) border p-4 transition hover:border-(--color-primary) hover:bg-(--color-muted)"
        >
          <div className="font-semibold">일반 사용자</div>
          <ul className="mt-1 space-y-0.5 text-sm text-(--color-muted-foreground)">
            <li>QR로 매뉴얼을 보고 저장합니다</li>
            <li>회사 등록 없이 가입</li>
          </ul>
        </Link>

        <Link
          href="/signup/company"
          className="block rounded-(--radius) border p-4 transition hover:border-(--color-primary) hover:bg-(--color-muted)"
        >
          <div className="font-semibold">회사 (제공자)</div>
          <ul className="mt-1 space-y-0.5 text-sm text-(--color-muted-foreground)">
            <li>제품 매뉴얼을 등록·관리합니다</li>
            <li>새 회사를 만들고 OWNER로 가입</li>
          </ul>
        </Link>
      </div>

      <p className="pt-4 text-center text-sm text-(--color-muted-foreground)">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-medium hover:underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
