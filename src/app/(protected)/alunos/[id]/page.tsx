import { notFound } from "next/navigation";
import { carregarAlunoDetalhe } from "@/actions/alunos-detalhes";
import { listarPeriodos } from "@/actions/periodos";
import { AlunoDetalheClient } from "@/components/alunos/aluno-detalhe-client";

const styles = {
  main: "mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-12 sm:px-8",
};

export default async function AlunoDetalhePage({
  params,
}: PageProps<"/alunos/[id]">) {
  const { id } = await params;
  const [detalhe, todosPeriodos] = await Promise.all([
    carregarAlunoDetalhe(id),
    listarPeriodos(),
  ]);

  if (!detalhe) notFound();

  return (
    <main className={styles.main}>
      <AlunoDetalheClient
        aluno={detalhe.aluno}
        matricula={detalhe.matricula}
        periodosDoAluno={detalhe.periodosDoAluno}
        todosPeriodos={todosPeriodos}
      />
    </main>
  );
}
