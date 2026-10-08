"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  getMatriculaDetalhe,
  type MatriculaDetalhe,
} from "@/lib/supabase/queries/matriculas";

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
  concluida: boolean,
  matriculaId: string
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("aula_matricula")
    .update({ concluida })
    .eq("id", aulaMatriculaId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/alunos/${matriculaId}`);
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

  revalidatePath(`/alunos/${matriculaId}`);
  revalidatePath("/alunos");
}
