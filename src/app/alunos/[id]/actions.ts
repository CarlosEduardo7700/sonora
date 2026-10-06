"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase/client";

export async function atualizarConclusaoAula(
  aulaMatriculaId: string,
  concluida: boolean,
  matriculaId: string
) {
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
