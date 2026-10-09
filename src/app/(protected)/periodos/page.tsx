import { listarPeriodosComAulas } from "@/actions/periodos";
import { PeriodosClient } from "@/components/periodos/periodos-client";

const styles = {
  main: "mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-12 sm:px-8",
};

export default async function PeriodosPage() {
  const periodos = await listarPeriodosComAulas();

  return (
    <main className={styles.main}>
      <PeriodosClient periodosIniciais={periodos} />
    </main>
  );
}
