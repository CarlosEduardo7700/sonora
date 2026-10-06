"use client";

import { useState } from "react";
import Link from "next/link";
import type { Aluno } from "@/data/alunos";
import type { Aula } from "@/data/aulas";
import { ProgressBar } from "@/components/progress-bar";
import { AulaCheckCard } from "@/components/aula-check-card";
import { Modal } from "@/components/modal";

type AlunoDetalheClientProps = {
  aluno: Aluno;
  aulasDoPeriodo: Aula[];
};

export function AlunoDetalheClient({
  aluno,
  aulasDoPeriodo,
}: AlunoDetalheClientProps) {
  const [concluidasIds, setConcluidasIds] = useState(
    aluno.aulasConcluidasIds
  );
  const [aulaSelecionada, setAulaSelecionada] = useState<Aula | null>(null);
  const [nota, setNota] = useState(aluno.nota);
  const [notaDraft, setNotaDraft] = useState(
    aluno.nota !== null ? String(aluno.nota) : ""
  );

  const totalAulas = aulasDoPeriodo.length;
  const aulasConcluidas = concluidasIds.length;
  const percentual =
    totalAulas > 0 ? Math.round((aulasConcluidas / totalAulas) * 100) : 0;

  const aulaSelecionadaEstaConcluida =
    aulaSelecionada !== null && concluidasIds.includes(aulaSelecionada.id);

  function handleConfirmar() {
    if (!aulaSelecionada) return;
    setConcluidasIds((prev) =>
      prev.includes(aulaSelecionada.id)
        ? prev.filter((id) => id !== aulaSelecionada.id)
        : [...prev, aulaSelecionada.id]
    );
    setAulaSelecionada(null);
  }

  function handleSalvarNota(event: React.FormEvent) {
    event.preventDefault();
    const valor = notaDraft.trim() === "" ? null : Number(notaDraft);
    if (valor !== null && (Number.isNaN(valor) || valor < 0 || valor > 10)) {
      return;
    }
    setNota(valor);
  }

  return (
    <>
      <Link
        href="/alunos"
        className="self-start text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        ← Voltar para a listagem
      </Link>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {aluno.nomeAluno}
        </h1>
        <p className="text-sm text-muted-foreground">
          {aluno.instrumento} · {aluno.nomePeriodo}
        </p>
      </div>

      <ProgressBar
        value={percentual}
        label={`${aulasConcluidas} de ${totalAulas} aulas concluídas`}
      />

      <form
        onSubmit={handleSalvarNota}
        className="flex flex-col gap-3 rounded-lg border border-border bg-card p-6 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-card-foreground">
            Nota do período
          </h2>
          {nota !== null && (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              {nota.toFixed(1)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={0}
            max={10}
            step={0.1}
            placeholder="0.0 a 10.0"
            value={notaDraft}
            onChange={(event) => setNotaDraft(event.target.value)}
            className="w-32 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Salvar nota
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-3">
        {aulasDoPeriodo.map((aula) => (
          <AulaCheckCard
            key={aula.id}
            aula={aula}
            concluida={concluidasIds.includes(aula.id)}
            onToggle={() => setAulaSelecionada(aula)}
          />
        ))}
      </div>

      <Modal
        open={aulaSelecionada !== null}
        onClose={() => setAulaSelecionada(null)}
        title={
          aulaSelecionadaEstaConcluida
            ? "Remover check da aula?"
            : "O aluno concluiu a aula?"
        }
      >
        {aulaSelecionada && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Aula {aulaSelecionada.numeroAula} · {aulaSelecionada.temaAula}
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAulaSelecionada(null)}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmar}
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Confirmar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
