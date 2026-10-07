import { createClient } from "@/lib/supabase/server";

export type Aluno = {
  id: string;
  nome: string;
  instrumento: string;
};

export async function getAlunos(): Promise<Aluno[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("alunos")
    .select("*")
    .order("nome");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
