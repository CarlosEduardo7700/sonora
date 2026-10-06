import Link from "next/link";
import type { ComponentProps } from "react";

type NavCardProps = {
  href: ComponentProps<typeof Link>["href"];
  title: string;
  description: string;
};

export function NavCard({ href, title, description }: NavCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-2 rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
    >
      <span className="text-lg font-semibold text-card-foreground">
        {title}
      </span>
      <span className="text-sm text-muted-foreground">{description}</span>
      <span className="mt-4 text-sm font-medium text-primary transition-transform group-hover:translate-x-1">
        Acessar →
      </span>
    </Link>
  );
}
