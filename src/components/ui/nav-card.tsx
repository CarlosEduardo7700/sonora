import Link from "next/link";
import type { ComponentProps } from "react";

type NavCardProps = {
  href: ComponentProps<typeof Link>["href"];
  title: string;
  description: string;
};

const styles = {
  link: "group flex flex-col gap-2 rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md",
  title: "text-lg font-semibold text-card-foreground",
  description: "text-sm text-muted-foreground",
  access: "mt-4 text-sm font-medium text-primary transition-transform group-hover:translate-x-1",
};

export function NavCard({ href, title, description }: NavCardProps) {
  return (
    <Link
      href={href}
      className={styles.link}
    >

      <span className={styles.title}>
        {title}
      </span>

      <span className={styles.description}>{description}</span>

      <span className={styles.access}>
        Acessar →
      </span>
      
    </Link>
  );
}
