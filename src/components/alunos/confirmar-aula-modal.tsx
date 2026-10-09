"use client";

import { Modal } from "@/components/ui/modal";
import type { AulaDaMatricula } from "@/repositories/matriculas";

type ConfirmarAulaModalProps = {
  aula: AulaDaMatricula | null;
  salvando: boolean;
  onClose: () => void;
  onConfirmar: () => void;
};

const styles = {
  container: "flex flex-col gap-4",
  text: "text-sm text-muted-foreground",
  buttonContainer: "flex justify-end gap-2",
  button: "rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary",
  submitButton: "rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60",
};

export function ConfirmarAulaModal({
  aula,
  salvando,
  onClose,
  onConfirmar,
}: ConfirmarAulaModalProps) {
  return (
    <Modal
      open={aula !== null}
      onClose={onClose}
      title={
        aula?.concluida ? "Remover check da aula?" : "O aluno concluiu a aula?"
      }
    >

      {aula && (

        <div className={styles.container}>

          <p className={styles.text}>
            Aula {aula.numeroAula} · {aula.tema}
          </p>

          <div className={styles.buttonContainer}>

            <button
              type="button"
              onClick={onClose}
              className={styles.button}
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={onConfirmar}
              disabled={salvando}
              className={styles.submitButton}
            >
              {salvando ? "Salvando..." : "Confirmar"}
            </button>

          </div>

        </div>

      )}
      
    </Modal>
  );
}
