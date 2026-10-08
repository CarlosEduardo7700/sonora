import type { PeriodoComAulas } from "@/repositories/periodos";

type PeriodoBoxProps = {
  periodo: PeriodoComAulas;
};

export function PeriodoBox({ periodo }: PeriodoBoxProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-card-foreground">
          {periodo.nome}
        </h2>
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          {periodo.aulas.length} {periodo.aulas.length === 1 ? "aula" : "aulas"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {periodo.aulas.map((aula) => (
          <div
            key={aula.id}
            className="flex items-center gap-3 rounded-md border border-border bg-muted p-4"
          >
            <span className="flex h-8 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              Aula {aula.numero_aula}
            </span>
            <span className="text-sm font-medium text-foreground">
              {aula.tema}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
