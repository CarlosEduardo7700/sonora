"use client";

import { useState } from "react";
import type { Aula } from "@/data/aulas";
import { PeriodoBox } from "@/components/periodo-box";
import { NovoPeriodoModal } from "@/components/novo-periodo-modal";

type PeriodosClientProps = {
  aulasIniciais: Aula[];
};

export function PeriodosClient({ aulasIniciais }: PeriodosClientProps) {
  const [aulas, setAulas] = useState(aulasIniciais);
  const [modalAberto, setModalAberto] = useState(false);
  const periodos = Object.groupBy(aulas, (aula) => aula.nomePeriodo);

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
        {Object.entries(periodos).map(([nomePeriodo, aulasDoPeriodo]) => (
          <PeriodoBox
            key={nomePeriodo}
            nomePeriodo={nomePeriodo}
            aulas={aulasDoPeriodo ?? []}
          />
        ))}
      </div>

      <NovoPeriodoModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSave={(novasAulas) => setAulas((prev) => [...prev, ...novasAulas])}
      />
    </>
  );
}
