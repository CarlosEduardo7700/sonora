"use server";

import { revalidatePath } from "next/cache";
import { getAlunoById } from "@/repositories/alunos";
import {
  createMatriculaComAulas,
  getMatriculaDetalhe,
  getMatriculasDoAluno,
  setAulaConcluida,
  updateNota,
} from "@/repositories/matriculas";
import { Aluno } from "@/types/aluno";
import { MatriculaDetalhe, MatriculaDoAluno } from "@/types/matricula";

export async function carregarAlunoDetalhe(alunoId: string): Promise<{
  aluno: Aluno;
  matricula: MatriculaDetalhe | null;
  periodosDoAluno: MatriculaDoAluno[];
} | null> {
  // Chamada ao repositório
  const [aluno, periodosDoAluno] = await Promise.all([
    getAlunoById(alunoId),
    getMatriculasDoAluno(alunoId),
  ]);

  if (!aluno) return null;

  // Chamada ao repositório
  const atual = periodosDoAluno.at(-1);
  const matricula = atual
    ? await getMatriculaDetalhe(atual.matriculaId)
    : null;

  // Retorno dos dados
  return { aluno, matricula, periodosDoAluno };
}

export async function adicionarPeriodoAoAluno(
  alunoId: string,
  periodoId: string
): Promise<{
  matricula: MatriculaDetalhe;
  periodosDoAluno: MatriculaDoAluno[];
}> {
  // Validações
  if (!alunoId || !periodoId) {
    throw new Error("Aluno e período são obrigatórios");
  }

  // Chamada ao repositório
  const existentes = await getMatriculasDoAluno(alunoId);
  if (existentes.some((item) => item.periodoId === periodoId)) {
    throw new Error("O aluno já está matriculado neste período");
  }

  const nova = await createMatriculaComAulas(alunoId, periodoId);
  const [matricula, periodosDoAluno] = await Promise.all([
    getMatriculaDetalhe(nova.id),
    getMatriculasDoAluno(alunoId),
  ]);

  if (!matricula) {
    throw new Error("Matrícula não encontrada");
  }

  // Retorno
  revalidatePath("/alunos");
  return { matricula, periodosDoAluno };
}

export async function trocarPeriodoMatricula(
  alunoId: string,
  matriculaId: string
): Promise<MatriculaDetalhe> {
  // Validações
  if (!alunoId || !matriculaId) {
    throw new Error("Aluno e matrícula são obrigatórios");
  }

  // Chamada ao repositório
  const matricula = await getMatriculaDetalhe(matriculaId);

  if (!matricula) {
    throw new Error("Matrícula não encontrada");
  }
  if (matricula.alunoId !== alunoId) {
    throw new Error("Matrícula não pertence a este aluno");
  }

  // Retorno
  return matricula;
}

export async function atualizarConclusaoAula(
  matriculaId: string,
  aulaId: string,
  concluida: boolean
) {
  // Validações
  if (!matriculaId || !aulaId) {
    throw new Error("Matrícula e aula são obrigatórias");
  }

  // Chamada ao repositório
  await setAulaConcluida(matriculaId, aulaId, concluida);

  // Retorno
  revalidatePath("/alunos");
}

export async function atualizarNota(matriculaId: string, nota: number | null) {
  // Validações
  if (!matriculaId || nota === null) {
    throw new Error("Matrícula e nota são obrigatórias");
  }

  // Chamada ao repositório
  await updateNota(matriculaId, nota);

  // Retorno
  revalidatePath("/alunos");
}
