import { createClient } from "@/lib/supabase/server";
import type { Matricula, MatriculaDoAluno, MatriculaDetalhe } from "@/types/matricula";

export async function getMatriculas(): Promise<Matricula[]> {
  // Instância do Supabase
  const supabase = await createClient();

  // Chamada ao Supabase
  const { data, error } = await supabase.from("matriculas").select("*");

  // Tratamento de erro
  if (error) {
    throw new Error(error.message);
  }

  // Retorno dos dados
  return data;
}

export async function getMatriculasDoAluno(
  alunoId: string
): Promise<MatriculaDoAluno[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("matriculas")
    .select("id, periodo_id, periodos(nome)")
    .eq("aluno_id", alunoId);

  if (error) {
    throw new Error(error.message);
  }

  return data
    .map((matricula) => ({
      matriculaId: matricula.id,
      periodoId: matricula.periodo_id,
      nomePeriodo: matricula.periodos?.nome ?? "-",
    }))
    .sort((a, b) => a.nomePeriodo.localeCompare(b.nomePeriodo));
}

export async function createMatriculaComAulas(
  alunoId: string,
  periodoId: string
): Promise<Matricula> {
  const supabase = await createClient();
  const { data: matricula, error: matriculaError } = await supabase
    .from("matriculas")
    .insert({ aluno_id: alunoId, periodo_id: periodoId })
    .select()
    .single();

  if (matriculaError) {
    throw new Error(matriculaError.message);
  }

  const { data: aulas, error: aulasError } = await supabase
    .from("aulas")
    .select("id")
    .eq("periodo_id", periodoId);

  if (aulasError) {
    await supabase.from("matriculas").delete().eq("id", matricula.id);
    throw new Error(aulasError.message);
  }

  if (aulas.length > 0) {
    const { error: checksError } = await supabase.from("aula_matricula").insert(
      aulas.map((aula) => ({
        matricula_id: matricula.id,
        aula_id: aula.id,
        concluida: false,
      }))
    );

    if (checksError) {
      await supabase.from("matriculas").delete().eq("id", matricula.id);
      throw new Error(checksError.message);
    }
  }

  return matricula;
}

export async function setAulaConcluida(
  matriculaId: string,
  aulaId: string,
  concluida: boolean
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("aula_matricula")
    .upsert(
      { matricula_id: matriculaId, aula_id: aulaId, concluida },
      { onConflict: "matricula_id,aula_id" }
    );

  if (error) {
    throw new Error(error.message);
  }
}

export async function getMatriculaDetalhe(
  matriculaId: string
): Promise<MatriculaDetalhe | null> {
  const supabase = await createClient();

  const { data: matricula, error: matriculaError } = await supabase
    .from("matriculas")
    .select("id, aluno_id, periodo_id, nota, alunos(nome, instrumento), periodos(nome)")
    .eq("id", matriculaId)
    .maybeSingle();

  if (matriculaError) {
    throw new Error(matriculaError.message);
  }

  if (!matricula || !matricula.alunos || !matricula.periodos) {
    return null;
  }

  const [
    { data: aulas, error: aulasError },
    { data: checks, error: checksError },
  ] = await Promise.all([
    supabase
      .from("aulas")
      .select("id, numero_aula, tema")
      .eq("periodo_id", matricula.periodo_id)
      .order("numero_aula"),

    supabase
      .from("aula_matricula")
      .select("id, aula_id, concluida")
      .eq("matricula_id", matriculaId),
  ]);

  if (aulasError) throw new Error(aulasError.message);
  if (checksError) throw new Error(checksError.message);

  const checksPorAulaId = new Map(
    checks.map((check) => [check.aula_id, check])
  );

  return {
    matriculaId: matricula.id,
    alunoId: matricula.aluno_id,
    nomeAluno: matricula.alunos.nome,
    instrumento: matricula.alunos.instrumento,
    periodoId: matricula.periodo_id,
    nomePeriodo: matricula.periodos.nome,
    nota: matricula.nota,
    aulas: aulas.map((aula) => {
      const check = checksPorAulaId.get(aula.id);

      return {
        aulaId: aula.id,
        aulaMatriculaId: check?.id ?? "",
        numeroAula: aula.numero_aula,
        tema: aula.tema,
        concluida: check?.concluida ?? false,
      };
    }),
  };
}

export async function getChecksAulas() {
  // Instância do Supabase
  const supabase = await createClient();

  // Chamada ao Supabase
  const { data, error } = await supabase
    .from("aula_matricula")
    .select("matricula_id, concluida");

  // Tratamento de erro
  if (error) throw new Error(error.message);
  
  // Retorno dos dados
  return data;
}
