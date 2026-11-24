import type { ComponentProps } from "react";
import { cn } from "@/shared/utils/class-names";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn("shared-form-text-input", className)} {...props} />;
}
