import { listarAlunosNaListagem } from "@/actions/alunos";
import { listarPeriodos } from "@/actions/periodos";
import { AlunosClient } from "@/components/alunos/alunos-client";

const styles = {
  main: "mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-12 sm:px-8",
};

export default async function AlunosPage() {
  const [alunos, periodos] = await Promise.all([
    listarAlunosNaListagem(),
    listarPeriodos(),
  ]);

  return (
    <main className={styles.main}>
      <AlunosClient alunosIniciais={alunos} periodosDisponiveis={periodos} />
    </main>
  );
}
