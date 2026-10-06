import { notFound } from "next/navigation";
import { alunosMock } from "@/data/alunos";
import { aulasMock } from "@/data/aulas";
import { AlunoDetalheClient } from "@/components/aluno-detalhe-client";

export default async function AlunoDetalhePage({
  params,
}: PageProps<"/alunos/[id]">) {
  const { id } = await params;
  const aluno = alunosMock.find((item) => item.id === id);

  if (!aluno) notFound();

  const aulasDoPeriodo = aulasMock
    .filter((aula) => aula.nomePeriodo === aluno.nomePeriodo)
    .sort((a, b) => a.numeroAula - b.numeroAula);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-12 sm:px-8">
      <AlunoDetalheClient aluno={aluno} aulasDoPeriodo={aulasDoPeriodo} />
    </main>
  );
}
