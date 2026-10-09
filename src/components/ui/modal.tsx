"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

const styles = {
  overlay: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4",
  modal: "w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-lg",
  title: "mb-4 text-lg font-semibold text-card-foreground",
};

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
      >

        <h2 className={styles.title}>
          {title}
        </h2>

        {children}

      </div>

    </div>
  );
}
