import type { Aluno } from "@/data/alunos";
import { ProgressBar } from "@/components/progress-bar";

type AlunoCardProps = {
  aluno: Aluno;
  totalAulas: number;
  aulasConcluidas: number;
};

export function AlunoCard({ aluno, totalAulas, aulasConcluidas }: AlunoCardProps) {
  const percentual =
    totalAulas > 0 ? Math.round((aulasConcluidas / totalAulas) * 100) : 0;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            {aluno.nomeAluno}
          </h2>
          <p className="text-sm text-muted-foreground">
            {aluno.instrumento} · {aluno.nomePeriodo}
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          Ver mais
        </button>
      </div>

      <ProgressBar
        value={percentual}
        label={`${aulasConcluidas} de ${totalAulas} aulas concluídas`}
      />
    </div>
  );
}
