export type Aluno = {
  id: string;
  nomeAluno: string;
  instrumento: string;
  // vínculo com o período: deve corresponder a Aula.nomePeriodo
  nomePeriodo: string;
  // ids das Aula já concluídas pelo aluno dentro do período
  aulasConcluidasIds: string[];
};

export const alunosMock: Aluno[] = [
  {
    id: "aluno-1",
    nomeAluno: "Ana Beatriz Souza",
    instrumento: "Violão",
    nomePeriodo: "S1/2027",
    aulasConcluidasIds: ["aula-1", "aula-2"],
  },
  {
    id: "aluno-2",
    nomeAluno: "Carlos Eduardo Lima",
    instrumento: "Piano",
    nomePeriodo: "S1/2027",
    aulasConcluidasIds: ["aula-1"],
  },
  {
    id: "aluno-3",
    nomeAluno: "Mariana Costa",
    instrumento: "Violino",
    nomePeriodo: "S2/2027",
    aulasConcluidasIds: [],
  },
  {
    id: "aluno-4",
    nomeAluno: "Pedro Henrique Alves",
    instrumento: "Bateria",
    nomePeriodo: "S2/2027",
    aulasConcluidasIds: ["aula-5", "aula-6", "aula-7"],
  },
];
