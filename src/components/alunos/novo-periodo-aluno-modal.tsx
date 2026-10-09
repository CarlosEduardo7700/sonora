"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import type { Periodo } from "@/repositories/periodos";

type NovoPeriodoAlunoModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirmar: (periodoId: string) => Promise<void>;
  periodosDisponiveis: Periodo[];
  erro: string | null;
};

const styles = {
  container: "flex flex-col gap-4",
  label: "flex flex-col gap-1 text-sm font-medium text-foreground",
  select: "rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none",
  error: "text-sm text-red-600",
  buttonContainer: "flex justify-end gap-2",
  button: "rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary",
  submitButton: "rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60",
};

export function NovoPeriodoAlunoModal({
  open,
  onClose,
  onConfirmar,
  periodosDisponiveis,
  erro,
}: NovoPeriodoAlunoModalProps) {
  const [periodoId, setPeriodoId] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSalvar(event: React.FormEvent) {
    event.preventDefault();
    if (!periodoId) return;

    setEnviando(true);
    try {
      await onConfirmar(periodoId);
      setPeriodoId("");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Adicionar período">

      {periodosDisponiveis.length === 0 ? (

        <div className={styles.container}>

          <p className={styles.error}>
            O aluno já está matriculado em todos os períodos cadastrados.
          </p>

          <div className={styles.buttonContainer}>
            <button
              type="button"
              onClick={onClose}
              className={styles.button}
            >
              Fechar
            </button>
          </div>

        </div>

      ) : (

        <form onSubmit={handleSalvar} className={styles.container}>

          <label className={styles.label}>
            Período
            <select
              value={periodoId}
              onChange={(event) => setPeriodoId(event.target.value)}
              required
              className={styles.select}
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

          {erro && <p className={styles.error}>{erro}</p>}

          <div className={styles.buttonContainer}>

            <button
              type="button"
              onClick={onClose}
              className={styles.button}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={enviando}
              className={styles.submitButton}
            >
              {enviando ? "Salvando..." : "Adicionar"}
            </button>

          </div>
          
        </form>

      )}
    </Modal>
  );
}
