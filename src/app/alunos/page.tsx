import { alunosMock } from "@/data/alunos";
import { aulasMock } from "@/data/aulas";
import { AlunosClient } from "@/components/alunos-client";

export default function AlunosPage() {
  const periodosDisponiveis = [
    ...new Set(aulasMock.map((aula) => aula.nomePeriodo)),
  ];

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-12 sm:px-8">
      <AlunosClient
        alunosIniciais={alunosMock}
        aulas={aulasMock}
        periodosDisponiveis={periodosDisponiveis}
      />
    </main>
  );
}
