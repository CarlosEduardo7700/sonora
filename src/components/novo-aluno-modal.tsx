"use client";

import { useState } from "react";
import { Modal } from "@/components/modal";
import { createAlunoComMatricula } from "@/app/(protected)/alunos/actions";
import type { AlunoNaListagem } from "@/lib/supabase/queries/matriculas";
import type { Periodo } from "@/lib/supabase/queries/periodos";

type NovoAlunoModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (aluno: AlunoNaListagem) => void;
  periodosDisponiveis: Periodo[];
};

const inputClassName =
  "rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none";

export function NovoAlunoModal({
  open,
  onClose,
  onCreated,
  periodosDisponiveis,
}: NovoAlunoModalProps) {
  const [nomeAluno, setNomeAluno] = useState("");
  const [instrumento, setInstrumento] = useState("");
  const [periodoId, setPeriodoId] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function resetAndClose() {
    setNomeAluno("");
    setInstrumento("");
    setPeriodoId("");
    setErro(null);
    onClose();
  }

  async function handleSalvar(event: React.FormEvent) {
    event.preventDefault();
    if (!nomeAluno.trim() || !instrumento.trim() || !periodoId) return;

    setEnviando(true);
    setErro(null);
    try {
      const aluno = await createAlunoComMatricula(
        nomeAluno,
        instrumento,
        periodoId
      );
      onCreated(aluno);
      resetAndClose();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao criar aluno");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal open={open} onClose={resetAndClose} title="Novo Aluno">
      <form onSubmit={handleSalvar} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-foreground">
          Nome
          <input
            type="text"
            value={nomeAluno}
            onChange={(event) => setNomeAluno(event.target.value)}
            required
            className={inputClassName}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-foreground">
          Instrumento
          <input
            type="text"
            value={instrumento}
            onChange={(event) => setInstrumento(event.target.value)}
            required
            className={inputClassName}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-foreground">
          Período
          <select
            value={periodoId}
            onChange={(event) => setPeriodoId(event.target.value)}
            required
            className={inputClassName}
          >
            <option value="" disabled>
              Selecione um período
            </option>
            {periodosDisponiveis.map((periodo) => (
              <option key={periodo.id} value={periodo.id}>
                {periodo.nome}
              </option>
            ))}
          </select>
        </label>
        {erro && <p className="text-sm text-red-600">{erro}</p>}
        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={resetAndClose}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={enviando}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {enviando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
