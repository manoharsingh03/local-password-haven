
export type Database = {
  public: {
    Tables: {
      passwords: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          username?: string;
          encrypted: string;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label: string;
          username?: string;
          encrypted: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string;
          username?: string;
          encrypted?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          type: 'income' | 'expense';
          category: string;
          description: string;
          date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          type: 'income' | 'expense';
          category: string;
          description: string;
          date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          type?: 'income' | 'expense';
          category?: string;
          description?: string;
          date?: string;
          created_at?: string;
        };
      };
    };
  };
};
