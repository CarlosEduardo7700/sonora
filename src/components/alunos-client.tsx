"use client";

import { useState } from "react";
import type { Aluno } from "@/data/alunos";
import type { Aula } from "@/data/aulas";
import { AlunoCard } from "@/components/aluno-card";
import { NovoAlunoModal } from "@/components/novo-aluno-modal";

type AlunosClientProps = {
  alunosIniciais: Aluno[];
  aulas: Aula[];
  periodosDisponiveis: string[];
};

export function AlunosClient({
  alunosIniciais,
  aulas,
  periodosDisponiveis,
}: AlunosClientProps) {
  const [alunos, setAlunos] = useState(alunosIniciais);
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Listagem dos Alunos
        </h1>
        <button
          type="button"
          onClick={() => setModalAberto(true)}
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Novo Aluno
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {alunos.map((aluno) => {
          const totalAulas = aulas.filter(
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

      <NovoAlunoModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSave={(novoAluno) => setAlunos((prev) => [...prev, novoAluno])}
        periodosDisponiveis={periodosDisponiveis}
      />
    </>
  );
}
