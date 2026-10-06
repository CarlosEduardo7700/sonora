"use client";

import { useState } from "react";
import type { Aula } from "@/data/aulas";
import { Modal } from "@/components/modal";

type RascunhoAula = {
  numeroAula: number;
  temaAula: string;
};

type NovoPeriodoModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (aulas: Aula[]) => void;
};

const inputClassName =
  "rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none";

export function NovoPeriodoModal({
  open,
  onClose,
  onSave,
}: NovoPeriodoModalProps) {
  const [etapa, setEtapa] = useState<"dados" | "aulas">("dados");
  const [quantidadeAulas, setQuantidadeAulas] = useState("");
  const [nomePeriodo, setNomePeriodo] = useState("");
  const [rascunhoAulas, setRascunhoAulas] = useState<RascunhoAula[]>([]);

  function resetAndClose() {
    setEtapa("dados");
    setQuantidadeAulas("");
    setNomePeriodo("");
    setRascunhoAulas([]);
    onClose();
  }

  function handleContinuar(event: React.FormEvent) {
    event.preventDefault();
    const quantidade = Number(quantidadeAulas);
    if (!quantidade || quantidade < 1 || !nomePeriodo.trim()) return;

    setRascunhoAulas(
      Array.from({ length: quantidade }, (_, index) => ({
        numeroAula: index + 1,
        temaAula: "",
      }))
    );
    setEtapa("aulas");
  }

  function handleTemaChange(numeroAula: number, value: string) {
    setRascunhoAulas((prev) =>
      prev.map((aula) =>
        aula.numeroAula === numeroAula ? { ...aula, temaAula: value } : aula
      )
    );
  }

  function handleSalvar(event: React.FormEvent) {
    event.preventDefault();
    const aulas: Aula[] = rascunhoAulas.map((aula) => ({
      ...aula,
      nomePeriodo: nomePeriodo.trim(),
    }));
    onSave(aulas);
    resetAndClose();
  }

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      title={etapa === "dados" ? "Novo Período" : `Aulas de ${nomePeriodo}`}
    >
      {etapa === "dados" ? (
        <form onSubmit={handleContinuar} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-foreground">
            Quantas aulas deseja cadastrar?
            <input
              type="number"
              min={1}
              value={quantidadeAulas}
              onChange={(event) => setQuantidadeAulas(event.target.value)}
              required
              className={inputClassName}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-foreground">
            Para qual período?
            <input
              type="text"
              placeholder="Ex: S1/2027"
              value={nomePeriodo}
              onChange={(event) => setNomePeriodo(event.target.value)}
              required
              className={inputClassName}
            />
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
              Continuar
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSalvar} className="flex flex-col gap-4">
          <div className="flex max-h-80 flex-col gap-3 overflow-y-auto pr-1">
            {rascunhoAulas.map((aula) => (
              <label
                key={aula.numeroAula}
                className="flex items-center gap-3 text-sm font-medium text-foreground"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {aula.numeroAula}
                </span>
                <input
                  type="text"
                  placeholder="Tema da aula"
                  value={aula.temaAula}
                  onChange={(event) =>
                    handleTemaChange(aula.numeroAula, event.target.value)
                  }
                  required
                  className={`flex-1 ${inputClassName}`}
                />
              </label>
            ))}
          </div>
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
      )}
    </Modal>
  );
}
