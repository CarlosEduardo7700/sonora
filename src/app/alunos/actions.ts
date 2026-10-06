"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase/client";
import type { MatriculaComProgresso } from "@/lib/matriculas";

export async function createAlunoComMatricula(
  nome: string,
  instrumento: string,
  periodoId: string
): Promise<MatriculaComProgresso> {
  const nomeTratado = nome.trim();
  const instrumentoTratado = instrumento.trim();
  if (!nomeTratado || !instrumentoTratado || !periodoId) {
    throw new Error("Nome, instrumento e período são obrigatórios");
  }

  const { data: periodo, error: periodoError } = await supabase
    .from("periodos")
    .select("id, nome")
    .eq("id", periodoId)
    .single();

  if (periodoError) {
    throw new Error("Período inválido");
  }

  const { data: aluno, error: alunoError } = await supabase
    .from("alunos")
    .insert({ nome: nomeTratado, instrumento: instrumentoTratado })
    .select()
    .single();

  if (alunoError) {
    throw new Error(alunoError.message);
  }

  const { data: matricula, error: matriculaError } = await supabase
    .from("matriculas")
    .insert({ aluno_id: aluno.id, periodo_id: periodo.id })
    .select()
    .single();

  if (matriculaError) {
    await supabase.from("alunos").delete().eq("id", aluno.id);
    throw new Error(matriculaError.message);
  }

  const { data: aulasDoPeriodo, error: aulasError } = await supabase
    .from("aulas")
    .select("id")
    .eq("periodo_id", periodo.id);

  if (aulasError) {
    await supabase.from("matriculas").delete().eq("id", matricula.id);
    await supabase.from("alunos").delete().eq("id", aluno.id);
    throw new Error(aulasError.message);
  }

  if (aulasDoPeriodo.length > 0) {
    const { error: checksError } = await supabase.from("aula_matricula").insert(
      aulasDoPeriodo.map((aula) => ({
        matricula_id: matricula.id,
        aula_id: aula.id,
        concluida: false,
      }))
    );

    if (checksError) {
      // desfaz matrícula e aluno se não conseguir criar os checks das aulas
      await supabase.from("matriculas").delete().eq("id", matricula.id);
      await supabase.from("alunos").delete().eq("id", aluno.id);
      throw new Error(checksError.message);
    }
  }

  revalidatePath("/alunos");

  return {
    matriculaId: matricula.id,
    alunoId: aluno.id,
    nomeAluno: aluno.nome,
    instrumento: aluno.instrumento,
    periodoId: periodo.id,
    nomePeriodo: periodo.nome,
    nota: matricula.nota,
    totalAulas: aulasDoPeriodo.length,
    aulasConcluidas: 0,
  };
}
