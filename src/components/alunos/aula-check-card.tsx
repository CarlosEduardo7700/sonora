import type { AulaDaMatricula } from "@/repositories/matriculas";

type AulaCheckCardProps = {
  aula: AulaDaMatricula;
  onToggle: () => void;
};

const styles = {
  button: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors",
  buttonConcluida: "border-primary bg-primary text-primary-foreground",
  buttonPendente: "border-border bg-background text-transparent hover:border-primary",
  container: "flex items-center gap-3 rounded-md border border-border bg-muted p-4",
  numeroAula: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground",
  tema: "flex-1 text-sm font-medium text-foreground",
}; 

export function AulaCheckCard({ aula, onToggle }: AulaCheckCardProps) {
  return (
    <div className={styles.container}>

      <span className={styles.numeroAula}>
        {aula.numeroAula}
      </span>

      <span className={styles.tema}>
        {aula.tema}
      </span>

      <button
        type="button"
        onClick={onToggle}
        aria-pressed={aula.concluida}
        aria-label={
          aula.concluida ? "Remover check da aula" : "Marcar aula como concluída"
        }
        className={`${styles.button} ${
          aula.concluida ? styles.buttonConcluida : styles.buttonPendente
        }`}
      >
        ✓
      </button>
      
    </div>
  );
}
