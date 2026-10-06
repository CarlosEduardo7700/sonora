import { supabase } from "@/lib/supabase/client";
import { getAulas, type Aula } from "@/lib/supabase/queries/aulas";

export type Periodo = {
  id: string;
  nome: string;
};

export type PeriodoComAulas = Periodo & { aulas: Aula[] };

export async function getPeriodos(): Promise<Periodo[]> {
  const { data, error } = await supabase
    .from("periodos")
    .select("*")
    .order("nome");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getPeriodosComAulas(): Promise<PeriodoComAulas[]> {
  const [periodos, aulas] = await Promise.all([getPeriodos(), getAulas()]);

  return periodos.map((periodo) => ({
    ...periodo,
    aulas: aulas.filter((aula) => aula.periodo_id === periodo.id),
  }));
}
