"use client";

import { useState } from "react";
import type { PeriodoComAulas } from "@/repositories/periodos";
import { PeriodoBox } from "@/components/periodos/periodo-box";
import { NovoPeriodoModal } from "@/components/periodos/novo-periodo-modal";

const styles = {
  headerPeriodo: "flex items-center justify-between gap-4",
  title: "text-2xl font-semibold tracking-tight text-foreground",
  button: "rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover",
  periodosContainer: "flex flex-col gap-6",
};

type PeriodosClientProps = {
  periodosIniciais: PeriodoComAulas[];
};

export function PeriodosClient({ periodosIniciais }: PeriodosClientProps) {
  const [periodos, setPeriodos] = useState(periodosIniciais);
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
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
    </>
  );
}
