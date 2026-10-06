// Tipos gerados manualmente a partir do schema SQL (periodos, alunos, matriculas, aulas, aula_matricula)
export type Database = {
  public: {
    Tables: {
      periodos: {
        Row: {
          id: string;
          nome: string;
        };
        Insert: {
          id?: string;
          nome: string;
        };
        Update: {
          id?: string;
          nome?: string;
        };
      };
      alunos: {
        Row: {
          id: string;
          nome: string;
          instrumento: string;
        };
        Insert: {
          id?: string;
          nome: string;
          instrumento: string;
        };
        Update: {
          id?: string;
          nome?: string;
          instrumento?: string;
        };
      };
      matriculas: {
        Row: {
          id: string;
          aluno_id: string;
          periodo_id: string;
          nota: number | null;
        };
        Insert: {
          id?: string;
          aluno_id: string;
          periodo_id: string;
          nota?: number | null;
        };
        Update: {
          id?: string;
          aluno_id?: string;
          periodo_id?: string;
          nota?: number | null;
        };
      };
      aulas: {
        Row: {
          id: string;
          numero_aula: number;
          tema: string;
          periodo_id: string;
        };
        Insert: {
          id?: string;
          numero_aula: number;
          tema: string;
          periodo_id: string;
        };
        Update: {
          id?: string;
          numero_aula?: number;
          tema?: string;
          periodo_id?: string;
        };
      };
      aula_matricula: {
        Row: {
          id: string;
          matricula_id: string;
          aula_id: string;
          concluida: boolean;
        };
        Insert: {
          id?: string;
          matricula_id: string;
          aula_id: string;
          concluida?: boolean;
        };
        Update: {
          id?: string;
          matricula_id?: string;
          aula_id?: string;
          concluida?: boolean;
        };
      };
    };
  };
};
