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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [
          {
            foreignKeyName: "matriculas_aluno_id_fkey";
            columns: ["aluno_id"];
            isOneToOne: false;
            referencedRelation: "alunos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matriculas_periodo_id_fkey";
            columns: ["periodo_id"];
            isOneToOne: false;
            referencedRelation: "periodos";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "aulas_periodo_id_fkey";
            columns: ["periodo_id"];
            isOneToOne: false;
            referencedRelation: "periodos";
            referencedColumns: ["id"];
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "aula_matricula_matricula_id_fkey";
            columns: ["matricula_id"];
            isOneToOne: false;
            referencedRelation: "matriculas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "aula_matricula_aula_id_fkey";
            columns: ["aula_id"];
            isOneToOne: false;
            referencedRelation: "aulas";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
