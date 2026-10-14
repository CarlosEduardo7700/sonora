import { createClient } from "@/lib/supabase/server";
import { Periodo, PeriodoComAulas } from "@/types/periodo";
import { NovaAula } from "@/types/aula";


export async function getPeriodos(): Promise<Periodo[]> {
  // Instância do Supabase
  const supabase = await createClient();

  // Chamada ao Supabase
  const { data, error } = await supabase
    .from("periodos")
    .select("*")
    .order("nome");

  // Tratamento de erro
  if (error) {
    throw new Error(error.message);
  }

  // Retorno
  return data;
}

export async function createPeriodoComAulas(
  nome: string,
  aulas: NovaAula[]
): Promise<PeriodoComAulas> {
  // Instância do Supabase
  const supabase = await createClient();

  // Chamada ao Supabase
  const { data: periodo, error: periodoError } = await supabase
    .from("periodos")
    .insert({ nome })
    .select()
    .single();

  // Tratamento de erro
  if (periodoError) {
    throw new Error(periodoError.message);
  }

  // Chamada ao Supabase
  const { data: aulasCriadas, error: aulasError } = await supabase
    .from("aulas")
    .insert(
      aulas.map((aula) => ({
        numero_aula: aula.numero_aula,
        tema: aula.tema,
        periodo_id: periodo.id,
      }))
    )
    .select();

  // Tratamento de erro
  if (aulasError) {
    await supabase.from("periodos").delete().eq("id", periodo.id);
    throw new Error(aulasError.message);
  }

  // Retorno
  return { ...periodo, aulas: aulasCriadas };
}
