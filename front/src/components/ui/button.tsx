import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

// DESIGN.md (Apple):
// - button-primary: Action Blue pill, padding 11px 22px, body 17px
// - button-secondary-pill: canvas bg, blue text, pill
// - button-dark-utility / ghost: 8px rounded compact (14px text)
const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "h-11 px-5 rounded-[10px] bg-(--color-ink) text-(--color-primary-foreground) text-[15px] hover:bg-black disabled:opacity-40",
  secondary:
    "h-11 px-5 rounded-[10px] bg-(--color-background) text-(--color-ink) text-[15px] border border-(--color-ink) hover:bg-(--color-canvas-parchment) disabled:opacity-40",
  ghost:
    "h-9 px-3 rounded-[8px] bg-transparent text-(--color-ink-muted-80) text-sm hover:bg-(--color-canvas-parchment) disabled:opacity-40",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className = "", variant = "primary", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`inline-flex items-center justify-center font-normal tracking-[-0.022em] transition focus-visible:outline-2 focus-visible:outline-(--color-primary-focus) focus-visible:outline-offset-2 ${variants[variant]} ${className}`}
      {...props}
    />
  );
});
