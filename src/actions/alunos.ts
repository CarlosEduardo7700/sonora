"use server";

import { revalidatePath } from "next/cache";
import { getMatriculas, getChecksAulas } from "@/repositories/matriculas";
import type { AlunoNaListagem, Matricula } from "@/types/matricula";
import { getAlunos, createAlunoComMatricula } from "@/repositories/alunos";
import { getPeriodos } from "@/repositories/periodos";

export async function listarAlunos(): Promise<AlunoNaListagem[]> {
  // Chamada ao repositório
  const [matriculas, alunos, periodos, checks] = await Promise.all([
    getMatriculas(),
    getAlunos(),
    getPeriodos(),
    getChecksAulas(),
  ]);

  const periodoNomePorId = new Map(
    periodos.map((periodo) => [periodo.id, periodo.nome])
  );

  const matriculasPorAluno = new Map<
    string,
    { matricula: Matricula; nomePeriodo: string }[]
  >();

  for (const matricula of matriculas) {
    const nomePeriodo =
      periodoNomePorId.get(matricula.periodo_id) ?? "-";

    const lista = matriculasPorAluno.get(matricula.aluno_id) ?? [];

    lista.push({ matricula, nomePeriodo });
    matriculasPorAluno.set(matricula.aluno_id, lista);
  }

  const matriculaAtualPorAluno = new Map<
    string,
    { matricula: Matricula; nomePeriodo: string }
  >();

  for (const [alunoId, lista] of matriculasPorAluno) {
    lista.sort((a, b) =>
      a.nomePeriodo.localeCompare(b.nomePeriodo)
    );

    const atual = lista.at(-1);

    if (atual) {
      matriculaAtualPorAluno.set(alunoId, atual);
    }
  }

  const checksPorMatricula = new Map<
    string,
    { total: number; concluidas: number }
  >();

  for (const check of checks) {
    const contagem = checksPorMatricula.get(check.matricula_id) ?? {
      total: 0,
      concluidas: 0,
    };

    contagem.total++;

    if (check.concluida) contagem.concluidas++;

    checksPorMatricula.set(check.matricula_id, contagem);
  }


  // Retorno dos dados
  return alunos.map((aluno) => {
    const atual = matriculaAtualPorAluno.get(aluno.id);

    const contagem = atual
      ? checksPorMatricula.get(atual.matricula.id)
      : undefined;

    return {
      alunoId: aluno.id,
      nomeAluno: aluno.nome,
      instrumento: aluno.instrumento,
      nomePeriodo: atual?.nomePeriodo ?? null,
      nota: atual?.matricula.nota ?? null,
      totalAulas: contagem?.total ?? 0,
      aulasConcluidas: contagem?.concluidas ?? 0,
    };
  });
}

export async function criarAlunoComMatricula(
  nome: string,
  instrumento: string,
  periodoId: string
): Promise<AlunoNaListagem> {
  // Validações
  const nomeTratado = nome.trim();
  const instrumentoTratado = instrumento.trim();

  if (!nomeTratado || !instrumentoTratado || !periodoId) {
    throw new Error("Nome, instrumento e período são obrigatórios");
  }

  // Chamada ao repositório
  const aluno = await createAlunoComMatricula(
    nomeTratado,
    instrumentoTratado,
    periodoId
  );

  // Retorno
  revalidatePath("/alunos");
  return aluno;
}
