import { aulasMock } from "@/data/aulas";
import { PeriodoBox } from "@/components/periodo-box";

export default function PeriodosPage() {
  const periodos = Object.groupBy(aulasMock, (aula) => aula.nomePeriodo);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-12 sm:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Listagem dos Períodos
      </h1>

      {Object.entries(periodos).map(([nomePeriodo, aulas]) => (
        <PeriodoBox
          key={nomePeriodo}
          nomePeriodo={nomePeriodo}
          aulas={aulas ?? []}
        />
      ))}
    </main>
  );
}
