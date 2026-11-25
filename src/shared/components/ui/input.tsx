import type { ComponentProps } from "react";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={["shared-form-text-input", className].filter(Boolean).join(" ")} {...props} />;
}
