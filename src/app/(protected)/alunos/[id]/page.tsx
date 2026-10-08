import { notFound } from "next/navigation";
import { getAlunoById } from "@/repositories/alunos";
import {
  getMatriculaDetalhe,
  getMatriculasDoAluno,
} from "@/repositories/matriculas";
import { getPeriodos } from "@/repositories/periodos";
import { AlunoDetalheClient } from "@/components/alunos/aluno-detalhe-client";

export default async function AlunoDetalhePage({
  params,
}: PageProps<"/alunos/[id]">) {
  const { id } = await params;
  const aluno = await getAlunoById(id);

  if (!aluno) notFound();

  const [periodosDoAluno, todosPeriodos] = await Promise.all([
    getMatriculasDoAluno(aluno.id),
    getPeriodos(),
  ]);

  // Lista ordenada por nome; o último é o período atual.
  const atual = periodosDoAluno.at(-1);
  const matricula = atual ? await getMatriculaDetalhe(atual.matriculaId) : null;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-12 sm:px-8">
      <AlunoDetalheClient
        aluno={aluno}
        matricula={matricula}
        periodosDoAluno={periodosDoAluno}
        todosPeriodos={todosPeriodos}
      />
    </main>
  );
}
