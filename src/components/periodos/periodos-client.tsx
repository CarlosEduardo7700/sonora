"use client";

import { useState } from "react";
import type { PeriodoComAulas } from "@/repositories/periodos";
import { PeriodoBox } from "@/components/periodos/periodo-box";
import { NovoPeriodoModal } from "@/components/periodos/novo-periodo-modal";

type PeriodosClientProps = {
  periodosIniciais: PeriodoComAulas[];
};

export function PeriodosClient({ periodosIniciais }: PeriodosClientProps) {
  const [periodos, setPeriodos] = useState(periodosIniciais);
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Listagem dos Períodos
        </h1>
        <button
          type="button"
          onClick={() => setModalAberto(true)}
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Novo Período
        </button>
      </div>

      <div className="flex flex-col gap-6">
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
