"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
