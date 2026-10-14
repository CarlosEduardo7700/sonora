"use server";

import { revalidatePath } from "next/cache";
import { getPeriodos, createPeriodoComAulas } from "@/repositories/periodos";
import { getAulas } from "@/repositories/aulas";
import type { PeriodoComAulas } from "@/types/periodo";
import type { NovaAula } from "@/types/aula";

export async function listarPeriodos() {
  // Chamada ao repositório e retorno
  return getPeriodos();
}

export async function listarPeriodosComAulas(): Promise<PeriodoComAulas[]> {
  // Chamada ao repositório
  const [periodos, aulas] = await Promise.all([
    getPeriodos(), 
    getAulas()
  ]);

  // Retorno
  return periodos.map((periodo) => ({
    ...periodo,
    aulas: aulas.filter((aula) => aula.periodo_id === periodo.id),
  }));
}

export async function criarPeriodoComAulas(
  nome: string,
  aulas: NovaAula[]
): Promise<PeriodoComAulas> {
  // Validações
  const nomeTratado = nome.trim();
  if (!nomeTratado) {
    throw new Error("Nome do período é obrigatório");
  }
  if (aulas.length === 0 || aulas.some((aula) => !aula.tema.trim())) {
    throw new Error("Todas as aulas precisam ter um tema");
  }

  // Chamada ao repositório
  const periodo = await createPeriodoComAulas(
    nomeTratado,
    aulas.map((aula) => ({
      ...aula,
      tema: aula.tema.trim(),
    }))
  );

  // Retorno
  revalidatePath("/periodos");
  return periodo;
}