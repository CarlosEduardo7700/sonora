"use client";

import { useState } from "react";
import type { Aluno } from "@/data/alunos";
import { Modal } from "@/components/modal";

type NovoAlunoModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (aluno: Aluno) => void;
  periodosDisponiveis: string[];
};

const inputClassName =
  "rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none";

export function NovoAlunoModal({
  open,
  onClose,
  onSave,
  periodosDisponiveis,
}: NovoAlunoModalProps) {
  const [nomeAluno, setNomeAluno] = useState("");
  const [instrumento, setInstrumento] = useState("");
  const [nomePeriodo, setNomePeriodo] = useState("");

  function resetAndClose() {
    setNomeAluno("");
    setInstrumento("");
    setNomePeriodo("");
    onClose();
  }

  function handleSalvar(event: React.FormEvent) {
    event.preventDefault();
    if (!nomeAluno.trim() || !instrumento.trim() || !nomePeriodo) return;

    onSave({
      id: crypto.randomUUID(),
      nomeAluno: nomeAluno.trim(),
      instrumento: instrumento.trim(),
      nomePeriodo,
      aulasConcluidasIds: [],
      nota: null,
    });
    resetAndClose();
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
            value={nomePeriodo}
            onChange={(event) => setNomePeriodo(event.target.value)}
            required
            className={inputClassName}
          >
            <option value="" disabled>
              Selecione um período
            </option>
            {periodosDisponiveis.map((periodo) => (
              <option key={periodo} value={periodo}>
                {periodo}
              </option>
            ))}
          </select>
        </label>
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
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}
