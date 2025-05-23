
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
          user_email: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          name: string;
          email?: string | null;
          user_email?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          name?: string;
          email?: string | null;
          user_email?: string | null;
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
          paid_by_email: string | null;
          split_type: string;
          finance_sync_enabled: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          title: string;
          amount: number;
          paid_by: string;
          paid_by_email?: string | null;
          split_type?: string;
          finance_sync_enabled?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          title?: string;
          amount?: number;
          paid_by?: string;
          paid_by_email?: string | null;
          split_type?: string;
          finance_sync_enabled?: boolean | null;
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
      settlements: {
        Row: {
          id: string;
          group_id: string;
          from_participant_id: string;
          to_participant_id: string;
          amount: number;
          description: string | null;
          settled_at: string | null;
          finance_synced: boolean | null;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          group_id: string;
          from_participant_id: string;
          to_participant_id: string;
          amount: number;
          description?: string | null;
          settled_at?: string | null;
          finance_synced?: boolean | null;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          group_id?: string;
          from_participant_id?: string;
          to_participant_id?: string;
          amount?: number;
          description?: string | null;
          settled_at?: string | null;
          finance_synced?: boolean | null;
          created_by?: string | null;
        };
      };
      finance_integrations: {
        Row: {
          id: string;
          user_id: string | null;
          group_id: string | null;
          enabled: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          group_id?: string | null;
          enabled?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          group_id?: string | null;
          enabled?: boolean | null;
          created_at?: string | null;
        };
      };
    };
  };
};

