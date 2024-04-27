export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          created_at: string
          date: string | null
          end_time: string | null
          id: number
          start_time: string | null
          training_id: number | null
        }
        Insert: {
          created_at?: string
          date?: string | null
          end_time?: string | null
          id?: number
          start_time?: string | null
          training_id?: number | null
        }
        Update: {
          created_at?: string
          date?: string | null
          end_time?: string | null
          id?: number
          start_time?: string | null
          training_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_events_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id"]
          },
        ]
      }
      events_users: {
        Row: {
          created_at: string
          event_id: number | null
          id: number
          irregular_event_id: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id?: number | null
          id?: number
          irregular_event_id?: number | null
          user_id?: string
        }
        Update: {
          created_at?: string
          event_id?: number | null
          id?: number
          irregular_event_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_users_irregular_event_id_fkey"
            columns: ["irregular_event_id"]
            isOneToOne: false
            referencedRelation: "irregular_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_events_users_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_events_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      irregular_events: {
        Row: {
          created_at: string
          date: string | null
          description: string | null
          end_time: string | null
          id: number
          location: string | null
          max_attendees: number | null
          start_time: string | null
          week_date: number | null
        }
        Insert: {
          created_at?: string
          date?: string | null
          description?: string | null
          end_time?: string | null
          id?: number
          location?: string | null
          max_attendees?: number | null
          start_time?: string | null
          week_date?: number | null
        }
        Update: {
          created_at?: string
          date?: string | null
          description?: string | null
          end_time?: string | null
          id?: number
          location?: string | null
          max_attendees?: number | null
          start_time?: string | null
          week_date?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          contain_html_content: boolean | null
          created_at: string
          id: number
          is_important: boolean
          subject: string | null
          text: string | null
        }
        Insert: {
          contain_html_content?: boolean | null
          created_at?: string
          id?: number
          is_important?: boolean
          subject?: string | null
          text?: string | null
        }
        Update: {
          contain_html_content?: boolean | null
          created_at?: string
          id?: number
          is_important?: boolean
          subject?: string | null
          text?: string | null
        }
        Relationships: []
      }
      trainings: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          end_time: string
          id: number
          location: string | null
          max_attendees: number | null
          start_date: string | null
          start_time: string
          week_date: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          end_time: string
          id?: number
          location?: string | null
          max_attendees?: number | null
          start_date?: string | null
          start_time: string
          week_date?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          end_time?: string
          id?: number
          location?: string | null
          max_attendees?: number | null
          start_date?: string | null
          start_time?: string
          week_date?: number | null
        }
        Relationships: []
      }
      trainings_users: {
        Row: {
          created_at: string
          id: number
          training_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          training_id: number
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          training_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_trainings_users_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_trainings_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          position: string | null
          role: string | null
          temp_password: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          position?: string | null
          role?: string | null
          temp_password?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          position?: string | null
          role?: string | null
          temp_password?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_events_for_admin: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          created_at: string
          date: string
          training_id: number
          event_start_time: string
          event_end_time: string
          description: string
          location: string
          max_attendees: number
          week_date: number
        }[]
      }
      get_events_for_attendee: {
        Args: {
          attendee_id: string
        }
        Returns: {
          id: number
          created_at: string
          date: string
          training_id: number
          event_start_time: string
          event_end_time: string
          description: string
          location: string
          max_attendees: number
          week_date: number
        }[]
      }
      get_irregular_events_for_attendee: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          created_at: string
          date: string
          event_start_time: string
          event_end_time: string
          description: string
          location: string
          max_attendees: number
          week_date: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
