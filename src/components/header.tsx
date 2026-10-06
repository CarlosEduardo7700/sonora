"use client";

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4 sm:px-8">
        <span className="text-xl font-semibold tracking-tight text-foreground">
          Sonora
        </span>
        <button
          type="button"
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
