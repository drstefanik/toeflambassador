import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function CtaButton({ href, children, variant = "primary", className }: Props) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold transition-colors";
  const variants = {
    primary: "bg-sky-600 text-white hover:bg-sky-700",
    secondary: "border border-sky-600 text-sky-600 hover:bg-sky-50",
  };

  return (
    <Link href={href} className={cn(baseStyles, variants[variant], className)}>
      {children}
    </Link>
  );
}
