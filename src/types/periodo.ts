import { Aula } from "@/repositories/aulas";

export type Periodo = {
  id: string;
  nome: string;
};

export type PeriodoComAulas = Periodo & { aulas: Aula[] };
