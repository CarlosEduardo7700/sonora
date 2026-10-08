import { notFound } from "next/navigation";
import {
  getMatriculaDetalhe,
  getMatriculasDoAluno,
} from "@/lib/supabase/queries/matriculas";
import { AlunoDetalheClient } from "@/components/aluno-detalhe-client";

export default async function AlunoDetalhePage({
  params,
}: PageProps<"/alunos/[id]">) {
  const { id } = await params;
  const matricula = await getMatriculaDetalhe(id);

  if (!matricula) notFound();

  const periodosDoAluno = await getMatriculasDoAluno(matricula.alunoId);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-12 sm:px-8">
      <AlunoDetalheClient
        matricula={matricula}
        periodosDoAluno={periodosDoAluno}
      />
    </main>
  );
}
