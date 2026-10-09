import Link from "next/link";
import type { AlunoNaListagem } from "@/repositories/matriculas";
import { ProgressBar } from "@/components/ui/progress-bar";

type AlunoCardProps = {
  aluno: AlunoNaListagem;
};

const styles = {
  card: "flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm",
  header: "flex items-start justify-between gap-4",
  title: "text-lg font-semibold text-card-foreground",
  subtitle: "text-sm text-muted-foreground",
  link: "shrink-0 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary",
}; 

export function AlunoCard({ aluno }: AlunoCardProps) {
  const percentual =
    aluno.totalAulas > 0
      ? Math.round((aluno.aulasConcluidas / aluno.totalAulas) * 100)
      : 0;

  return (
    <div className={styles.card}>

      <div className={styles.header}>

        <div>

          <h2 className={styles.title}>
            {aluno.nomeAluno}
          </h2>
          <p className={styles.subtitle}>
            {aluno.instrumento} · {aluno.nomePeriodo ?? "Sem período"}
          </p>
          
        </div>

        <Link
          href={`/alunos/${aluno.alunoId}`}
          className={styles.link}
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
