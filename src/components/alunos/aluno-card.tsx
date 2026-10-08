import Link from "next/link";
import type { AlunoNaListagem } from "@/repositories/matriculas";
import { ProgressBar } from "@/components/ui/progress-bar";

type AlunoCardProps = {
  aluno: AlunoNaListagem;
};

export function AlunoCard({ aluno }: AlunoCardProps) {
  const percentual =
    aluno.totalAulas > 0
      ? Math.round((aluno.aulasConcluidas / aluno.totalAulas) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            {aluno.nomeAluno}
          </h2>
          <p className="text-sm text-muted-foreground">
            {aluno.instrumento} · {aluno.nomePeriodo ?? "Sem período"}
          </p>
        </div>
        <Link
          href={`/alunos/${aluno.alunoId}`}
          className="shrink-0 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          Ver mais
        </Link>
      </div>

      <ProgressBar
        value={percentual}
        label={`${aluno.aulasConcluidas} de ${aluno.totalAulas} aulas concluídas`}
      />
    </div>
  );
}
