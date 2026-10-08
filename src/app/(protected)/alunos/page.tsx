import { getAlunosNaListagem } from "@/repositories/matriculas";
import { getPeriodos } from "@/repositories/periodos";
import { AlunosClient } from "@/components/alunos/alunos-client";

export default async function AlunosPage() {
  const [alunos, periodos] = await Promise.all([
    getAlunosNaListagem(),
    getPeriodos(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-12 sm:px-8">
      <AlunosClient alunosIniciais={alunos} periodosDisponiveis={periodos} />
    </main>
  );
}
