import { createClient } from "@/lib/supabase/server";
import { getAlunos } from "@/lib/supabase/queries/alunos";
import { getPeriodos } from "@/lib/supabase/queries/periodos";

export type Matricula = {
  id: string;
  aluno_id: string;
  periodo_id: string;
  nota: number | null;
};

export type AulaDaMatricula = {
  aulaId: string;
  aulaMatriculaId: string;
  numeroAula: number;
  tema: string;
  concluida: boolean;
};

export type MatriculaDetalhe = {
  matriculaId: string;
  alunoId: string;
  nomeAluno: string;
  instrumento: string;
  periodoId: string;
  nomePeriodo: string;
  nota: number | null;
  aulas: AulaDaMatricula[];
};

export type AlunoNaListagem = {
  alunoId: string;
  nomeAluno: string;
  instrumento: string;
  nomePeriodo: string | null;
  nota: number | null;
  totalAulas: number;
  aulasConcluidas: number;
};

export type MatriculaDoAluno = {
  matriculaId: string;
  periodoId: string;
  nomePeriodo: string;
};

export async function getMatriculas(): Promise<Matricula[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("matriculas").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getAlunosNaListagem(): Promise<
  AlunoNaListagem[]
> {
  const supabase = await createClient();
  const [matriculas, alunos, periodos, checksResult] = await Promise.all([
    getMatriculas(),
    getAlunos(),
    getPeriodos(),
    supabase.from("aula_matricula").select("matricula_id, concluida"),
  ]);

  if (checksResult.error) {
    throw new Error(checksResult.error.message);
  }

  const checks = checksResult.data;
  const periodosPorId = new Map(
    periodos.map((periodo) => [periodo.id, periodo])
  );

  return alunos.map((aluno) => {
    // Sem data no schema, o período "atual" é o de maior nome.
    const atual = matriculas
      .filter((matricula) => matricula.aluno_id === aluno.id)
      .map((matricula) => ({
        matricula,
        nomePeriodo: periodosPorId.get(matricula.periodo_id)?.nome ?? "-",
      }))
      .sort((a, b) => a.nomePeriodo.localeCompare(b.nomePeriodo))
      .at(-1);

    const checksDaMatricula = atual
      ? checks.filter((check) => check.matricula_id === atual.matricula.id)
      : [];

    return {
      alunoId: aluno.id,
      nomeAluno: aluno.nome,
      instrumento: aluno.instrumento,
      nomePeriodo: atual?.nomePeriodo ?? null,
      nota: atual?.matricula.nota ?? null,
      totalAulas: checksDaMatricula.length,
      aulasConcluidas: checksDaMatricula.filter((check) => check.concluida)
        .length,
    };
  });
}

export async function getMatriculasDoAluno(
  alunoId: string
): Promise<MatriculaDoAluno[]> {
  const supabase = await createClient();
  const [matriculasResult, periodos] = await Promise.all([
    supabase.from("matriculas").select("*").eq("aluno_id", alunoId),
    getPeriodos(),
  ]);

  if (matriculasResult.error) {
    throw new Error(matriculasResult.error.message);
  }

  const periodosPorId = new Map(
    periodos.map((periodo) => [periodo.id, periodo])
  );

  return matriculasResult.data
    .map((matricula) => ({
      matriculaId: matricula.id,
      periodoId: matricula.periodo_id,
      nomePeriodo: periodosPorId.get(matricula.periodo_id)?.nome ?? "-",
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

export async function getMatriculaDetalhe(
  matriculaId: string
): Promise<MatriculaDetalhe | null> {
  const supabase = await createClient();
  const { data: matricula, error: matriculaError } = await supabase
    .from("matriculas")
    .select("*")
    .eq("id", matriculaId)
    .maybeSingle();

  if (matriculaError) {
    throw new Error(matriculaError.message);
  }
  if (!matricula) {
    return null;
  }

  const [alunoResult, periodoResult, aulasResult, checksResult] =
    await Promise.all([
      supabase.from("alunos").select("*").eq("id", matricula.aluno_id).single(),
      supabase
        .from("periodos")
        .select("*")
        .eq("id", matricula.periodo_id)
        .single(),
      supabase
        .from("aulas")
        .select("*")
        .eq("periodo_id", matricula.periodo_id)
        .order("numero_aula"),
      supabase
        .from("aula_matricula")
        .select("*")
        .eq("matricula_id", matriculaId),
    ]);

  if (alunoResult.error) throw new Error(alunoResult.error.message);
  if (periodoResult.error) throw new Error(periodoResult.error.message);
  if (aulasResult.error) throw new Error(aulasResult.error.message);
  if (checksResult.error) throw new Error(checksResult.error.message);

  const checksPorAulaId = new Map(
    checksResult.data.map((check) => [check.aula_id, check])
  );

  const aulas: AulaDaMatricula[] = aulasResult.data.map((aula) => {
    const check = checksPorAulaId.get(aula.id);
    return {
      aulaId: aula.id,
      aulaMatriculaId: check?.id ?? "",
      numeroAula: aula.numero_aula,
      tema: aula.tema,
      concluida: check?.concluida ?? false,
    };
  });

  return {
    matriculaId: matricula.id,
    alunoId: alunoResult.data.id,
    nomeAluno: alunoResult.data.nome,
    instrumento: alunoResult.data.instrumento,
    periodoId: periodoResult.data.id,
    nomePeriodo: periodoResult.data.nome,
    nota: matricula.nota,
    aulas,
  };
}
