import Link from "next/link";
import { signOut } from "@/actions/auth";

const styles = {
  header: "sticky top-0 z-10 w-full border-b border-border bg-card/80 backdrop-blur-sm",
  container: "mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4 sm:px-8",
  link: "text-xl font-semibold tracking-tight text-foreground transition-colors hover:text-primary",
  button: "rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary",
};

export function Header() {
  return (
    <header className={styles.header}>

      <div className={styles.container}>

        <Link
          href="/"
          className={styles.link}
        >
          Sonora
        </Link>

        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button
            type="submit"
            className={styles.button}
          >
            Sair
          </button>
        </form>
        
      </div>

    </header>
  );
}
