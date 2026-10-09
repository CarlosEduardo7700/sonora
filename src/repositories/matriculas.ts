import { createClient } from "@/lib/supabase/server";
import { getAlunos } from "@/repositories/alunos";
import { getPeriodos } from "@/repositories/periodos";

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

export async function getAlunosNaListagem(): Promise<AlunoNaListagem[]> {
  const supabase = await createClient();

  const [matriculas, alunos, periodos, checksResult] = await Promise.all([
    getMatriculas(),
    getAlunos(),
    getPeriodos(),
    supabase
      .from("aula_matricula")
      .select("matricula_id, concluida"),
  ]);

  if (checksResult.error) {
    throw new Error(checksResult.error.message);
  }

  const periodoNomePorId = new Map(
    periodos.map((periodo) => [periodo.id, periodo.nome])
  );

  // Agrupa as matrículas por aluno.
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

  // Identifica a matrícula do período atual de cada aluno.
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

  // Calcula o total de aulas e as concluídas por matrícula.
  const checksPorMatricula = new Map<
    string,
    { total: number; concluidas: number }
  >();

  for (const check of checksResult.data) {
    const contagem = checksPorMatricula.get(check.matricula_id) ?? {
      total: 0,
      concluidas: 0,
    };

    contagem.total++;

    if (check.concluida) {
      contagem.concluidas++;
    }

    checksPorMatricula.set(check.matricula_id, contagem);
  }

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
