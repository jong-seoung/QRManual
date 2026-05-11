import { forwardRef, type InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

// DESIGN.md (Apple) search-input/text-input:
// - height 44px, padding 12px 20px
// - pill rounded
// - hairline 1px border, focus → blue outline
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = "", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`h-11 w-full rounded-[10px] border border-(--color-hairline) bg-(--color-background) px-4 py-3 text-[16px] text-(--color-ink) tracking-[-0.022em] outline-none placeholder:text-(--color-ink-muted-48) focus-visible:border-(--color-ink) focus-visible:outline-2 focus-visible:outline-(--color-ink) focus-visible:outline-offset-0 ${className}`}
      {...props}
    />
  );
});
