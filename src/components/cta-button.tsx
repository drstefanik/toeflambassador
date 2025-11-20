import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
  className?: string;
};

export function CtaButton({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
}: Props) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full font-semibold transition-colors";
  const variants = {
    primary: "bg-sky-600 text-white hover:bg-sky-700",
    secondary: "border border-sky-600 text-sky-600 hover:bg-sky-50",
  };
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
  };

  return (
    <Link href={href} className={cn(baseStyles, sizes[size], variants[variant], className)}>
      {children}
    </Link>
  );
}
