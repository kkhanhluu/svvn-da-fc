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
      competition_teams: {
        Row: {
          abbr: string | null
          competition_id: number
          created_at: string
          id: number
          is_own_team: boolean
          name: string
        }
        Insert: {
          abbr?: string | null
          competition_id: number
          created_at?: string
          id?: number
          is_own_team?: boolean
          name: string
        }
        Update: {
          abbr?: string | null
          competition_id?: number
          created_at?: string
          id?: number
          is_own_team?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_teams_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      competitions: {
        Row: {
          created_at: string
          end_date: string | null
          id: number
          legs: number
          name: string
          organizer: string | null
          season: string | null
          start_date: string | null
          status: string
          team_count: number | null
          venue: string | null
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: number
          legs?: number
          name: string
          organizer?: string | null
          season?: string | null
          start_date?: string | null
          status?: string
          team_count?: number | null
          venue?: string | null
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: number
          legs?: number
          name?: string
          organizer?: string | null
          season?: string | null
          start_date?: string | null
          status?: string
          team_count?: number | null
          venue?: string | null
        }
        Relationships: []
      }
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
      match_events: {
        Row: {
          assist_name: string | null
          assist_user_id: string | null
          competition_team_id: number
          created_at: string
          id: number
          match_id: number
          minute: number | null
          note: string | null
          player_name: string | null
          player_user_id: string | null
          type: string
        }
        Insert: {
          assist_name?: string | null
          assist_user_id?: string | null
          competition_team_id: number
          created_at?: string
          id?: number
          match_id: number
          minute?: number | null
          note?: string | null
          player_name?: string | null
          player_user_id?: string | null
          type?: string
        }
        Update: {
          assist_name?: string | null
          assist_user_id?: string | null
          competition_team_id?: number
          created_at?: string
          id?: number
          match_id?: number
          minute?: number | null
          note?: string | null
          player_name?: string | null
          player_user_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_events_competition_team_id_fkey"
            columns: ["competition_team_id"]
            isOneToOne: false
            referencedRelation: "competition_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      match_lineups: {
        Row: {
          competition_team_id: number
          created_at: string
          id: number
          is_starter: boolean
          match_id: number
          user_id: string
        }
        Insert: {
          competition_team_id: number
          created_at?: string
          id?: number
          is_starter?: boolean
          match_id: number
          user_id: string
        }
        Update: {
          competition_team_id?: number
          created_at?: string
          id?: number
          is_starter?: boolean
          match_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_lineups_competition_team_id_fkey"
            columns: ["competition_team_id"]
            isOneToOne: false
            referencedRelation: "competition_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_lineups_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          away_score: number | null
          away_team_id: number
          competition_id: number
          created_at: string
          home_score: number | null
          home_team_id: number
          id: number
          kickoff_time: string | null
          match_date: string
          referee: string | null
          round: number | null
          status: string
          venue: string | null
        }
        Insert: {
          away_score?: number | null
          away_team_id: number
          competition_id: number
          created_at?: string
          home_score?: number | null
          home_team_id: number
          id?: number
          kickoff_time?: string | null
          match_date: string
          referee?: string | null
          round?: number | null
          status?: string
          venue?: string | null
        }
        Update: {
          away_score?: number | null
          away_team_id?: number
          competition_id?: number
          created_at?: string
          home_score?: number | null
          home_team_id?: number
          id?: number
          kickoff_time?: string | null
          match_date?: string
          referee?: string | null
          round?: number | null
          status?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "competition_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "competition_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      motm_votes: {
        Row: {
          created_at: string
          id: number
          match_id: number
          player_name: string | null
          player_user_id: string | null
          voter_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          match_id: number
          player_name?: string | null
          player_user_id?: string | null
          voter_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          match_id?: number
          player_name?: string | null
          player_user_id?: string | null
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "motm_votes_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
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
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          position: string | null
          role: string | null
          score: number | null
          shirt_number: number | null
          temp_password: string | null
          times_of_cleaning: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          position?: string | null
          role?: string | null
          score?: number | null
          shirt_number?: number | null
          temp_password?: string | null
          times_of_cleaning?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          position?: string | null
          role?: string | null
          score?: number | null
          shirt_number?: number | null
          temp_password?: string | null
          times_of_cleaning?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_competition_scorers: {
        Args: {
          p_competition_id: number
        }
        Returns: {
          player_key: string
          player_name: string
          user_id: string | null
          team_name: string
          goals: number
          assists: number
          avatar_url: string | null
        }[]
      }
      get_competition_standings: {
        Args: {
          p_competition_id: number
        }
        Returns: {
          team_id: number
          team_name: string
          abbr: string | null
          is_own_team: boolean
          played: number
          won: number
          drawn: number
          lost: number
          goals_for: number
          goals_against: number
          goal_diff: number
          points: number
        }[]
      }
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
      get_player_competition_stats: {
        Args: {
          p_user_id: string
        }
        Returns: {
          competition_id: number
          competition_name: string
          apps: number
          goals: number
          assists: number
        }[]
      }
      get_squad_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          first_name: string | null
          last_name: string | null
          player_position: string | null
          shirt_number: number | null
          apps: number
          goals: number
          assists: number
          avatar_url: string | null
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
