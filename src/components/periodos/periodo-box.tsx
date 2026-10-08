import type { PeriodoComAulas } from "@/repositories/periodos";

type PeriodoBoxProps = {
  periodo: PeriodoComAulas;
};

const styles = {
  container: "flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm",
  header: "flex items-center justify-between",
  title: "text-lg font-semibold text-card-foreground",
  badge: "rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground",
  aulasGrid: "grid grid-cols-1 gap-3 sm:grid-cols-2",
  aulaCard: "flex items-center gap-3 rounded-md border border-border bg-muted p-4",
  aulaNumero: "flex h-8 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground",
  aulaTema: "text-sm font-medium text-foreground",
};

export function PeriodoBox({ periodo }: PeriodoBoxProps) {
  return (

    <div className={styles.container}>

      <div className={styles.header}>

        <h2 className={styles.title}>
          {periodo.nome}
        </h2>
        <span className={styles.badge}>
          {periodo.aulas.length} {periodo.aulas.length === 1 ? "aula" : "aulas"}
        </span>

      </div>

      <div className={styles.aulasGrid}>

        {periodo.aulas.map((aula) => (

          <div
            key={aula.id}
            className={styles.aulaCard}
          >

            <span className={styles.aulaNumero}>
              Aula {aula.numero_aula}
            </span>
            <span className={styles.aulaTema}>
              {aula.tema}
            </span>
            
          </div>

        ))}

      </div>

    </div>
  );
}
