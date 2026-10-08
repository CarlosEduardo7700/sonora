"use client";

import { listarPeriodosComAulas } from "@/actions/periodos";
import { PeriodoBox } from "@/components/periodos/periodo-box";
import { NovoPeriodoModal } from "@/components/periodos/novo-periodo-modal";
import { useEffect, useState } from "react";

const styles = {
  main: "mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-12 sm:px-8",
  headerPeriodo: "flex items-center justify-between gap-4",
  title: "text-2xl font-semibold tracking-tight text-foreground",
  button: "rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover",
  periodosContainer: "flex flex-col gap-6",
};

export default function PeriodosPage() {
  const [periodos, setPeriodos] = useState<Awaited<ReturnType<typeof listarPeriodosComAulas>>>([]);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    let isMounted = true;

    listarPeriodosComAulas().then((periodosRecuperados) => {
      if (isMounted) {
        setPeriodos(periodosRecuperados);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className={styles.main}>

      <div className={styles.headerPeriodo}>
        <h1 className={styles.title}>
          Listagem dos Períodos
        </h1>
        <button
          type="button"
          onClick={() => setModalAberto(true)}
          className={styles.button}
        >
          Novo Período
        </button>
      </div>

      <div className={styles.periodosContainer}>
        {periodos.map((periodo) => (
          <PeriodoBox key={periodo.id} periodo={periodo} />
        ))}
      </div>

      <NovoPeriodoModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onCreated={(periodo) => setPeriodos((prev) => [...prev, periodo])}
      />
    </main>
  );
}
