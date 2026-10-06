import { supabase } from "@/lib/supabase/client";

export type Aula = {
  id: string;
  numero_aula: number;
  tema: string;
  periodo_id: string;
};

export async function getAulas(): Promise<Aula[]> {
  const { data, error } = await supabase
    .from("aulas")
    .select("*")
    .order("numero_aula");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
