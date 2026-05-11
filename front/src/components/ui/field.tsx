import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}

// DESIGN.md (Apple): label은 caption-strong (14px/600/-0.224px) 톤.
export function Field({ label, htmlFor, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold tracking-[-0.016em] text-(--color-ink)"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-sm text-(--color-error)">
          {error}
        </p>
      ) : null}
    </div>
  );
}
