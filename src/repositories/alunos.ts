import { createClient } from "@/lib/supabase/server";
import type { Aluno } from "@/types/aluno";
import { AlunoNaListagem } from "@/types/matricula";

export async function getAlunos(): Promise<Aluno[]> {
  // Instância do Supabase
  const supabase = await createClient();

  // Chamada ao Supabase
  const { data, error } = await supabase
    .from("alunos")
    .select("*")
    .order("nome");

  // Tratamento de erro
  if (error) {
    throw new Error(error.message);
  }

  // Retorno
  return data;
}

export async function getAlunoById(id: string): Promise<Aluno | null> {
  // Instância do Supabase
  const supabase = await createClient();

  // Chamada ao Supabase
  const { data, error } = await supabase
    .from("alunos")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  // Tratamento de erro
  if (error) {
    throw new Error(error.message);
  }

  // Retorno
  return data;
}

export async function createAlunoComMatricula(
  nome: string,
  instrumento: string,
  periodoId: string
): Promise<AlunoNaListagem> {
  // Instância do Supabase
  const supabase = await createClient();

  // Chamada ao Supabase
  const { data: periodo, error: periodoError } = await supabase
    .from("periodos")
    .select("id, nome")
    .eq("id", periodoId)
    .single();

  // Tratamento de erro
  if (periodoError) {
    throw new Error("Período inválido");
  }

  // Chamada ao Supabase
  const { data: aluno, error: alunoError } = await supabase
    .from("alunos")
    .insert({ nome, instrumento })
    .select("id, nome, instrumento")
    .single();

  // Tratamento de erro
  if (alunoError) {
    throw new Error(alunoError.message);
  }

  // Chamada ao Supabase
  const { data: matricula, error: matriculaError } = await supabase
    .from("matriculas")
    .insert({ aluno_id: aluno.id, periodo_id: periodo.id })
    .select("id, nota")
    .single();

  // Tratamento de erro
  if (matriculaError) {
    await supabase.from("alunos").delete().eq("id", aluno.id);
    throw new Error(matriculaError.message);
  }

  // Chamada ao Supabase
  const { data: aulasDoPeriodo, error: aulasError } = await supabase
    .from("aulas")
    .select("id")
    .eq("periodo_id", periodo.id);

  // Tratamento de erro
  if (aulasError) {
    await supabase.from("matriculas").delete().eq("id", matricula.id);
    await supabase.from("alunos").delete().eq("id", aluno.id);
    throw new Error(aulasError.message);
  }

  if (aulasDoPeriodo.length > 0) {
    // Chamada ao Supabase
    const { error: checksError } = await supabase
      .from("aula_matricula")
      .insert(
        aulasDoPeriodo.map((aula) => ({
          matricula_id: matricula.id,
          aula_id: aula.id,
          concluida: false,
        }))
      );

    // Tratamento de erro
    if (checksError) {
      await supabase.from("matriculas").delete().eq("id", matricula.id);
      await supabase.from("alunos").delete().eq("id", aluno.id);
      throw new Error(checksError.message);
    }
  }

  // Retorno
  return {
    alunoId: aluno.id,
    nomeAluno: aluno.nome,
    instrumento: aluno.instrumento,
    nomePeriodo: periodo.nome,
    nota: matricula.nota,
    totalAulas: aulasDoPeriodo.length,
    aulasConcluidas: 0,
  };
}
