import { supabase } from "@/lib/supabase/client";

export type Aluno = {
  id: string;
  nome: string;
  instrumento: string;
};

export async function getAlunos(): Promise<Aluno[]> {
  const { data, error } = await supabase
    .from("alunos")
    .select("*")
    .order("nome");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
