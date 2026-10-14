"use client";

import type { ReactNode } from "react";
import { Modal } from "@/components/ui/modal";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

const styles = {
  container: "flex flex-col gap-4",
  text: "text-sm text-muted-foreground",
  error: "text-sm text-red-600",
  buttonContainer: "flex justify-end gap-2",
  cancelButton: "rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary",
  confirmButton: "rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60",
};

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  loadingLabel = "Salvando...",
  loading = false,
  error,
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>

      <div className={styles.container}>

        {description && <div className={styles.text}>{description}</div>}

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttonContainer}>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className={styles.cancelButton}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={styles.confirmButton}
          >
            {loading ? loadingLabel : confirmLabel}
          </button>

        </div>

      </div>

    </Modal>
  );
}
