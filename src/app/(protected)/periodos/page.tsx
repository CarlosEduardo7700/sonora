import { getPeriodosComAulas } from "@/lib/supabase/queries/periodos";
import { PeriodosClient } from "@/components/periodos-client";

export default async function PeriodosPage() {
  const periodos = await getPeriodosComAulas();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-12 sm:px-8">
      <PeriodosClient periodosIniciais={periodos} />
    </main>
  );
}
