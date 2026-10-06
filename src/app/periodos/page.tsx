import { aulasMock } from "@/data/aulas";
import { PeriodosClient } from "@/components/periodos-client";

export default function PeriodosPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-12 sm:px-8">
      <PeriodosClient aulasIniciais={aulasMock} />
    </main>
  );
}
