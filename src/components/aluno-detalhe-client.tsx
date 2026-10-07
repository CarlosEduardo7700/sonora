"use client";

import { useState } from "react";
import Link from "next/link";
import type {
  AulaDaMatricula,
  MatriculaDetalhe,
} from "@/lib/supabase/queries/matriculas";
import { ProgressBar } from "@/components/progress-bar";
import { AulaCheckCard } from "@/components/aula-check-card";
import { Modal } from "@/components/modal";
import {
  atualizarConclusaoAula,
  atualizarNota,
} from "@/app/(protected)/alunos/[id]/actions";

type AlunoDetalheClientProps = {
  matricula: MatriculaDetalhe;
};

export function AlunoDetalheClient({ matricula }: AlunoDetalheClientProps) {
  const [aulas, setAulas] = useState(matricula.aulas);
  const [aulaSelecionada, setAulaSelecionada] =
    useState<AulaDaMatricula | null>(null);
  const [nota, setNota] = useState(matricula.nota);
  const [notaDraft, setNotaDraft] = useState(
    matricula.nota !== null ? String(matricula.nota) : ""
  );
  const [salvandoAula, setSalvandoAula] = useState(false);
  const [salvandoNota, setSalvandoNota] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const totalAulas = aulas.length;
  const aulasConcluidas = aulas.filter((aula) => aula.concluida).length;
  const percentual =
    totalAulas > 0 ? Math.round((aulasConcluidas / totalAulas) * 100) : 0;

  async function handleConfirmar() {
    if (!aulaSelecionada) return;
    const novoEstado = !aulaSelecionada.concluida;

    setSalvandoAula(true);
    setErro(null);
    try {
      await atualizarConclusaoAula(
        aulaSelecionada.aulaMatriculaId,
        novoEstado,
        matricula.matriculaId
      );
      setAulas((prev) =>
        prev.map((aula) =>
          aula.aulaId === aulaSelecionada.aulaId
            ? { ...aula, concluida: novoEstado }
            : aula
        )
      );
      setAulaSelecionada(null);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao atualizar aula");
    } finally {
      setSalvandoAula(false);
    }
  }

  async function handleSalvarNota(event: React.FormEvent) {
    event.preventDefault();
    const valor = notaDraft.trim() === "" ? null : Number(notaDraft);
    if (valor !== null && (Number.isNaN(valor) || valor < 0 || valor > 10)) {
      return;
    }

    setSalvandoNota(true);
    setErro(null);
    try {
      await atualizarNota(matricula.matriculaId, valor);
      setNota(valor);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao salvar nota");
    } finally {
      setSalvandoNota(false);
    }
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
          {matricula.nomeAluno}
        </h1>
        <p className="text-sm text-muted-foreground">
          {matricula.instrumento} · {matricula.nomePeriodo}
        </p>
      </div>

      <ProgressBar
        value={percentual}
        label={`${aulasConcluidas} de ${totalAulas} aulas concluídas`}
      />

      {erro && <p className="text-sm text-red-600">{erro}</p>}

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
            disabled={salvandoNota}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {salvandoNota ? "Salvando..." : "Salvar nota"}
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-3">
        {aulas.map((aula) => (
          <AulaCheckCard
            key={aula.aulaId}
            aula={aula}
            onToggle={() => setAulaSelecionada(aula)}
          />
        ))}
      </div>

      <Modal
        open={aulaSelecionada !== null}
        onClose={() => setAulaSelecionada(null)}
        title={
          aulaSelecionada?.concluida
            ? "Remover check da aula?"
            : "O aluno concluiu a aula?"
        }
      >
        {aulaSelecionada && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Aula {aulaSelecionada.numeroAula} · {aulaSelecionada.tema}
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
                disabled={salvandoAula}
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
              >
                {salvandoAula ? "Salvando..." : "Confirmar"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
