import { alunosMock } from "@/data/alunos";
import { aulasMock } from "@/data/aulas";
import { AlunoCard } from "@/components/aluno-card";

export default function AlunosPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-12 sm:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Listagem dos Alunos
      </h1>

      <div className="flex flex-col gap-4">
        {alunosMock.map((aluno) => {
          const totalAulas = aulasMock.filter(
            (aula) => aula.nomePeriodo === aluno.nomePeriodo
          ).length;

          return (
            <AlunoCard
              key={aluno.id}
              aluno={aluno}
              totalAulas={totalAulas}
              aulasConcluidas={aluno.aulasConcluidasIds.length}
            />
          );
        })}
      </div>
    </main>
  );
}
