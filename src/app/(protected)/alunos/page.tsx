"use client";

import { listarAlunosNaListagem } from "@/actions/alunos";
import { listarPeriodos } from "@/actions/periodos";
import type { AlunoNaListagem } from "@/repositories/matriculas";
import type { Periodo } from "@/repositories/periodos";
import { AlunoCard } from "@/components/alunos/aluno-card";
import { NovoAlunoModal } from "@/components/alunos/novo-aluno-modal";

import { useEffect, useState } from "react";

const styles = {
  main: "mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-12 sm:px-8",
  title: "text-2xl font-semibold tracking-tight text-foreground",
  button: "rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover",
  alunosContainer: "flex flex-col gap-4",
  header: "flex items-center justify-between gap-4",
};

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<AlunoNaListagem[]>([]);
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.all([listarAlunosNaListagem(), listarPeriodos()]).then(
      ([alunosRecuperados, periodosRecuperados]) => {
        if (isMounted) {
          setAlunos(alunosRecuperados);
          setPeriodos(periodosRecuperados);
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className={styles.main}>

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
        periodosDisponiveis={periodos}
      />
      
    </main>
  );
}
