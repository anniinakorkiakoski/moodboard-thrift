export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      search_results: {
        Row: {
          created_at: string
          currency: string | null
          description: string | null
          id: string
          image_url: string | null
          item_url: string
          platform: Database["public"]["Enums"]["platform_type"]
          price: number | null
          search_id: string
          similarity_score: number | null
          title: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          item_url: string
          platform: Database["public"]["Enums"]["platform_type"]
          price?: number | null
          search_id: string
          similarity_score?: number | null
          title: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          item_url?: string
          platform?: Database["public"]["Enums"]["platform_type"]
          price?: number | null
          search_id?: string
          similarity_score?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_results_search_id_fkey"
            columns: ["search_id"]
            isOneToOne: false
            referencedRelation: "visual_searches"
            referencedColumns: ["id"]
          },
        ]
      }
      thrift_requests: {
        Row: {
          budget: number | null
          created_at: string
          customer_id: string
          id: string
          notes: string | null
          search_id: string
          status: string
          thrifter_id: string | null
          updated_at: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          customer_id: string
          id?: string
          notes?: string | null
          search_id: string
          status?: string
          thrifter_id?: string | null
          updated_at?: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          customer_id?: string
          id?: string
          notes?: string | null
          search_id?: string
          status?: string
          thrifter_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "thrift_requests_search_id_fkey"
            columns: ["search_id"]
            isOneToOne: false
            referencedRelation: "visual_searches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thrift_requests_thrifter_id_fkey"
            columns: ["thrifter_id"]
            isOneToOne: false
            referencedRelation: "thrifters"
            referencedColumns: ["id"]
          },
        ]
      }
      thrifters: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          id: string
          is_verified: boolean | null
          pricing_info: string | null
          rating: number | null
          specialties: string[] | null
          total_orders: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name: string
          id?: string
          is_verified?: boolean | null
          pricing_info?: string | null
          rating?: number | null
          specialties?: string[] | null
          total_orders?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          is_verified?: boolean | null
          pricing_info?: string | null
          rating?: number | null
          specialties?: string[] | null
          total_orders?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_images: {
        Row: {
          aspect_ratio: number | null
          caption: string | null
          created_at: string
          file_name: string
          file_path: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          aspect_ratio?: number | null
          caption?: string | null
          created_at?: string
          file_name: string
          file_path: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          aspect_ratio?: number | null
          caption?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      visual_searches: {
        Row: {
          analysis_data: Json | null
          created_at: string
          id: string
          image_url: string
          status: Database["public"]["Enums"]["search_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_data?: Json | null
          created_at?: string
          id?: string
          image_url: string
          status?: Database["public"]["Enums"]["search_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_data?: Json | null
          created_at?: string
          id?: string
          image_url?: string
          status?: Database["public"]["Enums"]["search_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      platform_type:
        | "vinted"
        | "tise"
        | "etsy"
        | "emmy"
        | "facebook_marketplace"
        | "depop"
        | "other_vintage"
      search_status:
        | "pending"
        | "analyzing"
        | "searching"
        | "completed"
        | "no_matches"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      platform_type: [
        "vinted",
        "tise",
        "etsy",
        "emmy",
        "facebook_marketplace",
        "depop",
        "other_vintage",
      ],
      search_status: [
        "pending",
        "analyzing",
        "searching",
        "completed",
        "no_matches",
      ],
    },
  },
} as const
