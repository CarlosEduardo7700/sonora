import type { Aula } from "@/data/aulas";

type AulaCheckCardProps = {
  aula: Aula;
  concluida: boolean;
  onToggle: () => void;
};

export function AulaCheckCard({ aula, concluida, onToggle }: AulaCheckCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-muted p-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
        {aula.numeroAula}
      </span>
      <span className="flex-1 text-sm font-medium text-foreground">
        {aula.temaAula}
      </span>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={concluida}
        aria-label={
          concluida ? "Remover check da aula" : "Marcar aula como concluída"
        }
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors ${
          concluida
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background text-transparent hover:border-primary"
        }`}
      >
        ✓
      </button>
    </div>
  );
}
