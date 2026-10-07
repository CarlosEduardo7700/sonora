"use client";

import { useState } from "react";
import { Modal } from "@/components/modal";
import { createPeriodoComAulas } from "@/app/(protected)/periodos/actions";
import type { PeriodoComAulas } from "@/lib/supabase/queries/periodos";

type RascunhoAula = {
  numeroAula: number;
  temaAula: string;
};

type NovoPeriodoModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (periodo: PeriodoComAulas) => void;
};

const inputClassName =
  "rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none";

export function NovoPeriodoModal({
  open,
  onClose,
  onCreated,
}: NovoPeriodoModalProps) {
  const [etapa, setEtapa] = useState<"dados" | "aulas">("dados");
  const [quantidadeAulas, setQuantidadeAulas] = useState("");
  const [nomePeriodo, setNomePeriodo] = useState("");
  const [rascunhoAulas, setRascunhoAulas] = useState<RascunhoAula[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function resetAndClose() {
    setEtapa("dados");
    setQuantidadeAulas("");
    setNomePeriodo("");
    setRascunhoAulas([]);
    setErro(null);
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

  async function handleSalvar(event: React.FormEvent) {
    event.preventDefault();

    setEnviando(true);
    setErro(null);
    try {
      const periodo = await createPeriodoComAulas(
        nomePeriodo,
        rascunhoAulas.map((aula) => ({
          numero_aula: aula.numeroAula,
          tema: aula.temaAula,
        }))
      );
      onCreated(periodo);
      resetAndClose();
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao criar período"
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      title={etapa === "dados" ? "Novo Período" : `Aulas de "${nomePeriodo}"`}
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
              placeholder="Ex: MSA: Módulo 1 ao 3"
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
                <span className="flex h-8 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  Aula {aula.numeroAula}
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
      )}
    </Modal>
  );
}
