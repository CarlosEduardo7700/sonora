import { supabase } from "@/lib/supabase/client";
import { getAlunos } from "@/lib/alunos";
import { getPeriodos } from "@/lib/periodos";

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

export type MatriculaComProgresso = {
  matriculaId: string;
  alunoId: string;
  nomeAluno: string;
  instrumento: string;
  periodoId: string;
  nomePeriodo: string;
  nota: number | null;
  totalAulas: number;
  aulasConcluidas: number;
};

export async function getMatriculas(): Promise<Matricula[]> {
  const { data, error } = await supabase.from("matriculas").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getMatriculasComProgresso(): Promise<
  MatriculaComProgresso[]
> {
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
  const alunosPorId = new Map(alunos.map((aluno) => [aluno.id, aluno]));
  const periodosPorId = new Map(
    periodos.map((periodo) => [periodo.id, periodo])
  );

  return matriculas.map((matricula) => {
    const aluno = alunosPorId.get(matricula.aluno_id);
    const periodo = periodosPorId.get(matricula.periodo_id);
    const checksDaMatricula = checks.filter(
      (check) => check.matricula_id === matricula.id
    );

    return {
      matriculaId: matricula.id,
      alunoId: matricula.aluno_id,
      nomeAluno: aluno?.nome ?? "Aluno não encontrado",
      instrumento: aluno?.instrumento ?? "-",
      periodoId: matricula.periodo_id,
      nomePeriodo: periodo?.nome ?? "-",
      nota: matricula.nota,
      totalAulas: checksDaMatricula.length,
      aulasConcluidas: checksDaMatricula.filter((check) => check.concluida)
        .length,
    };
  });
}

export async function getMatriculaDetalhe(
  matriculaId: string
): Promise<MatriculaDetalhe | null> {
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
