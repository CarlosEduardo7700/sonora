export type Aula = {
  id: string;
  numeroAula: number;
  temaAula: string;
  nomePeriodo: string;
};

export const aulasMock: Aula[] = [
  {
    id: "aula-1",
    numeroAula: 1,
    temaAula: "Introdução à Teoria Musical",
    nomePeriodo: "S1/2027",
  },
  {
    id: "aula-2",
    numeroAula: 2,
    temaAula: "Escalas e Intervalos",
    nomePeriodo: "S1/2027",
  },
  {
    id: "aula-3",
    numeroAula: 3,
    temaAula: "Ritmo e Compasso",
    nomePeriodo: "S1/2027",
  },
  {
    id: "aula-4",
    numeroAula: 4,
    temaAula: "Harmonia Básica",
    nomePeriodo: "S1/2027",
  },
  {
    id: "aula-5",
    numeroAula: 1,
    temaAula: "Solfejo",
    nomePeriodo: "S2/2027",
  },
  {
    id: "aula-6",
    numeroAula: 2,
    temaAula: "Interpretação Musical",
    nomePeriodo: "S2/2027",
  },
  {
    id: "aula-7",
    numeroAula: 3,
    temaAula: "Claves",
    nomePeriodo: "S2/2027",
  },
];
