"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { PeriodoComAulas } from "@/repositories/periodos";
import { getPeriodosComAulas } from "@/repositories/periodos";

type NovaAula = {
  numero_aula: number;
  tema: string;
};

export async function listarPeriodosComAulas(): Promise<PeriodoComAulas[]> {
  return getPeriodosComAulas();
}

export async function createPeriodoComAulas(
  nome: string,
  aulas: NovaAula[]
): Promise<PeriodoComAulas> {
  const supabase = await createClient();
  const nomeTratado = nome.trim();
  if (!nomeTratado) {
    throw new Error("Nome do período é obrigatório");
  }
  if (aulas.length === 0 || aulas.some((aula) => !aula.tema.trim())) {
    throw new Error("Todas as aulas precisam ter um tema");
  }

  const { data: periodo, error: periodoError } = await supabase
    .from("periodos")
    .insert({ nome: nomeTratado })
    .select()
    .single();

  if (periodoError) {
    throw new Error(periodoError.message);
  }

  const { data: aulasCriadas, error: aulasError } = await supabase
    .from("aulas")
    .insert(
      aulas.map((aula) => ({
        numero_aula: aula.numero_aula,
        tema: aula.tema.trim(),
        periodo_id: periodo.id,
      }))
    )
    .select();

  if (aulasError) {
    // evita período órfão sem aulas quando a segunda inserção falha
    await supabase.from("periodos").delete().eq("id", periodo.id);
    throw new Error(aulasError.message);
  }

  revalidatePath("/periodos");
  return { ...periodo, aulas: aulasCriadas };
}

