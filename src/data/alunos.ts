export type Aluno = {
  id: string;
  nomeAluno: string;
  instrumento: string;
  // vínculo com o período: deve corresponder a Aula.nomePeriodo
  nomePeriodo: string;
  // ids das Aula já concluídas pelo aluno dentro do período
  aulasConcluidasIds: string[];
  // nota do aluno no período (0 a 10), null quando ainda não lançada
  nota: number | null;
};

export const alunosMock: Aluno[] = [
  {
    id: "aluno-1",
    nomeAluno: "Ana Beatriz Souza",
    instrumento: "Violão",
    nomePeriodo: "S1/2027",
    aulasConcluidasIds: ["aula-1", "aula-2"],
    nota: 8.5,
  },
  {
    id: "aluno-2",
    nomeAluno: "Carlos Eduardo Lima",
    instrumento: "Piano",
    nomePeriodo: "S1/2027",
    aulasConcluidasIds: ["aula-1"],
    nota: null,
  },
  {
    id: "aluno-3",
    nomeAluno: "Mariana Costa",
    instrumento: "Violino",
    nomePeriodo: "S2/2027",
    aulasConcluidasIds: [],
    nota: null,
  },
  {
    id: "aluno-4",
    nomeAluno: "Pedro Henrique Alves",
    instrumento: "Bateria",
    nomePeriodo: "S2/2027",
    aulasConcluidasIds: ["aula-5", "aula-6", "aula-7"],
    nota: 9.2,
  },
];

