
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
      groups: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      participants: {
        Row: {
          id: string;
          group_id: string;
          name: string;
          email: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          name: string;
          email?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          name?: string;
          email?: string | null;
          created_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          group_id: string;
          title: string;
          amount: number;
          paid_by: string;
          split_type: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          title: string;
          amount: number;
          paid_by: string;
          split_type?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          title?: string;
          amount?: number;
          paid_by?: string;
          split_type?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      splits: {
        Row: {
          id: string;
          expense_id: string;
          participant_id: string;
          amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          expense_id: string;
          participant_id: string;
          amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          expense_id?: string;
          participant_id?: string;
          amount?: number;
          created_at?: string;
        };
      };
    };
  };
};
