import { getMatriculasComProgresso } from "@/lib/matriculas";
import { getPeriodos } from "@/lib/periodos";
import { AlunosClient } from "@/components/alunos-client";

export default async function AlunosPage() {
  const [alunos, periodos] = await Promise.all([
    getMatriculasComProgresso(),
    getPeriodos(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-12 sm:px-8">
      <AlunosClient alunosIniciais={alunos} periodosDisponiveis={periodos} />
    </main>
  );
}
