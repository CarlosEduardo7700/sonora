"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAlunoById, type Aluno } from "@/repositories/alunos";
import {
  createMatriculaComAulas,
  getMatriculaDetalhe,
  getMatriculasDoAluno,
  type MatriculaDetalhe,
  type MatriculaDoAluno,
} from "@/repositories/matriculas";

export async function carregarAlunoDetalhe(alunoId: string): Promise<{
  aluno: Aluno;
  matricula: MatriculaDetalhe | null;
  periodosDoAluno: MatriculaDoAluno[];
} | null> {
  const aluno = await getAlunoById(alunoId);
  if (!aluno) return null;

  const periodosDoAluno = await getMatriculasDoAluno(aluno.id);

  // Lista ordenada por nome; o último é o período atual.
  const atual = periodosDoAluno.at(-1);
  const matricula = atual ? await getMatriculaDetalhe(atual.matriculaId) : null;

  return { aluno, matricula, periodosDoAluno };
}

export async function adicionarPeriodoAoAluno(
  alunoId: string,
  periodoId: string
): Promise<{
  matricula: MatriculaDetalhe;
  periodosDoAluno: MatriculaDoAluno[];
}> {
  if (!alunoId || !periodoId) {
    throw new Error("Aluno e período são obrigatórios");
  }

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

  revalidatePath("/alunos");

  return { matricula, periodosDoAluno };
}

export async function trocarPeriodoMatricula(
  alunoId: string,
  matriculaId: string
): Promise<MatriculaDetalhe> {
  if (!alunoId || !matriculaId) {
    throw new Error("Aluno e matrícula são obrigatórios");
  }

  const matricula = await getMatriculaDetalhe(matriculaId);

  if (!matricula) {
    throw new Error("Matrícula não encontrada");
  }
  if (matricula.alunoId !== alunoId) {
    throw new Error("Matrícula não pertence a este aluno");
  }

  return matricula;
}

export async function atualizarConclusaoAula(
  aulaMatriculaId: string,
  concluida: boolean
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("aula_matricula")
    .update({ concluida })
    .eq("id", aulaMatriculaId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/alunos/[id]", "page");
  revalidatePath("/alunos");
}

export async function atualizarNota(matriculaId: string, nota: number | null) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("matriculas")
    .update({ nota })
    .eq("id", matriculaId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/alunos/[id]", "page");
  revalidatePath("/alunos");
}
