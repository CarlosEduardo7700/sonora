"use client";

import { useState } from "react";
import type { MatriculaComProgresso } from "@/lib/supabase/queries/matriculas";
import type { Periodo } from "@/lib/supabase/queries/periodos";
import { AlunoCard } from "@/components/aluno-card";
import { NovoAlunoModal } from "@/components/novo-aluno-modal";

type AlunosClientProps = {
  alunosIniciais: MatriculaComProgresso[];
  periodosDisponiveis: Periodo[];
};

export function AlunosClient({
  alunosIniciais,
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
        {alunos.map((aluno) => (
          <AlunoCard key={aluno.matriculaId} aluno={aluno} />
        ))}
      </div>

      <NovoAlunoModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onCreated={(novoAluno) => setAlunos((prev) => [...prev, novoAluno])}
        periodosDisponiveis={periodosDisponiveis}
      />
    </>
  );
}
