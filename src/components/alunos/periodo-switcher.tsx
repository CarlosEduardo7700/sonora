"use client";

import { useEffect, useRef, useState } from "react";
import type { MatriculaDoAluno } from "@/repositories/matriculas";

type PeriodoSwitcherProps = {
  periodoAtual: string;
  periodos: MatriculaDoAluno[];
  matriculaAtualId: string;
  disabled?: boolean;
  onSelecionar: (matriculaId: string) => void;
};

const styles = {
  button: "inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 font-medium text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-default disabled:opacity-60 disabled:hover:border-border disabled:hover:text-foreground",
  dropdown: "absolute left-0 top-full z-10 mt-1 min-w-[10rem] rounded-md border border-border bg-card py-1 shadow-lg",
  dropdownItem: "block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
  dropdownItemActive: "font-semibold text-primary",
  dropdownItemInactive: "text-foreground",
};

export function PeriodoSwitcher({
  periodoAtual,
  periodos,
  matriculaAtualId,
  disabled,
  onSelecionar,
}: PeriodoSwitcherProps) {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;

    function handleClickFora(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setAberto(false);
      }
    }

    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, [aberto]);

  const podeAlternar = periodos.length > 1;

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => podeAlternar && setAberto((prev) => !prev)}
        disabled={disabled || !podeAlternar}
        className={styles.button}
      >
        {periodoAtual}
        {podeAlternar && <span aria-hidden>▾</span>}
      </button>

      {aberto && (
        <div className={styles.dropdown}>
          {periodos.map((periodo) => (
            <button
              key={periodo.matriculaId}
              type="button"
              onClick={() => {
                setAberto(false);
                onSelecionar(periodo.matriculaId);
              }}
              className={`${styles.dropdownItem} ${
                periodo.matriculaId === matriculaAtualId
                  ? styles.dropdownItemActive
                  : styles.dropdownItemInactive
              }`}
            >
              {periodo.nomePeriodo}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
