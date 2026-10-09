"use client";

import { useState } from "react";
import type { AlunoNaListagem } from "@/repositories/matriculas";
import type { Periodo } from "@/repositories/periodos";
import { AlunoCard } from "@/components/alunos/aluno-card";
import { NovoAlunoModal } from "@/components/alunos/novo-aluno-modal";

const styles = {
  title: "text-2xl font-semibold tracking-tight text-foreground",
  button: "rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover",
  alunosContainer: "flex flex-col gap-4",
  header: "flex items-center justify-between gap-4",
};

type AlunosClientProps = {
  alunosIniciais: AlunoNaListagem[];
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
      <div className={styles.header}>

        <h1 className={styles.title}>
          Listagem dos Alunos
        </h1>

        <button
          type="button"
          onClick={() => setModalAberto(true)}
          className={styles.button}
        >
          Novo Aluno
        </button>

      </div>

      <div className={styles.alunosContainer}>

        {alunos.map((aluno) => (
          <AlunoCard key={aluno.alunoId} aluno={aluno} />
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
