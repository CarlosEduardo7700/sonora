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