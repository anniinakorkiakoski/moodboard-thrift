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
      catalog_admin_uploads: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          items_count: number | null
          platform: string
          status: string | null
          uploaded_by: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          items_count?: number | null
          platform: string
          status?: string | null
          uploaded_by: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          items_count?: number | null
          platform?: string
          status?: string | null
          uploaded_by?: string
        }
        Relationships: []
      }
      catalog_items: {
        Row: {
          attributes: Json | null
          condition: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          embedding: string | null
          external_id: string
          id: string
          image_url: string | null
          indexed_at: string | null
          is_active: boolean | null
          item_url: string
          last_verified_at: string | null
          location: string | null
          platform: string
          price: number | null
          shipping_info: string | null
          size: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          attributes?: Json | null
          condition?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          embedding?: string | null
          external_id: string
          id?: string
          image_url?: string | null
          indexed_at?: string | null
          is_active?: boolean | null
          item_url: string
          last_verified_at?: string | null
          location?: string | null
          platform: string
          price?: number | null
          shipping_info?: string | null
          size?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          attributes?: Json | null
          condition?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          embedding?: string | null
          external_id?: string
          id?: string
          image_url?: string | null
          indexed_at?: string | null
          is_active?: boolean | null
          item_url?: string
          last_verified_at?: string | null
          location?: string | null
          platform?: string
          price?: number | null
          shipping_info?: string | null
          size?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      connections: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          initiated_by: string
          message: string | null
          priority: number | null
          status: string
          thrifter_id: string
          updated_at: string
          waitlist_notes: string | null
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          initiated_by: string
          message?: string | null
          priority?: number | null
          status?: string
          thrifter_id: string
          updated_at?: string
          waitlist_notes?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          initiated_by?: string
          message?: string | null
          priority?: number | null
          status?: string
          thrifter_id?: string
          updated_at?: string
          waitlist_notes?: string | null
        }
        Relationships: []
      }
      saved_items: {
        Row: {
          created_at: string | null
          currency: string | null
          id: string
          image_url: string | null
          item_url: string
          notes: string | null
          platform: string
          price: number | null
          search_result_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          id?: string
          image_url?: string | null
          item_url: string
          notes?: string | null
          platform: string
          price?: number | null
          search_result_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          id?: string
          image_url?: string | null
          item_url?: string
          notes?: string | null
          platform?: string
          price?: number | null
          search_result_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_items_search_result_id_fkey"
            columns: ["search_result_id"]
            isOneToOne: false
            referencedRelation: "search_results"
            referencedColumns: ["id"]
          },
        ]
      }
      search_results: {
        Row: {
          created_at: string
          currency: string | null
          description: string | null
          id: string
          image_url: string | null
          item_url: string
          match_explanation: string | null
          matched_attributes: Json | null
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
          match_explanation?: string | null
          matched_attributes?: Json | null
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
          match_explanation?: string | null
          matched_attributes?: Json | null
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
          current_active_customers: number | null
          display_name: string
          id: string
          is_verified: boolean | null
          max_active_customers: number | null
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
          current_active_customers?: number | null
          display_name: string
          id?: string
          is_verified?: boolean | null
          max_active_customers?: number | null
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
          current_active_customers?: number | null
          display_name?: string
          id?: string
          is_verified?: boolean | null
          max_active_customers?: number | null
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
          display_order: number | null
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
          display_order?: number | null
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
          display_order?: number | null
          file_name?: string
          file_path?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_measurements: {
        Row: {
          arm_length: number | null
          bicep_circumference: number | null
          chest_circumference: number | null
          created_at: string
          hip_circumference: number | null
          id: string
          inseam_length: number | null
          neck_circumference: number | null
          shoulder_width: number | null
          thigh_circumference: number | null
          torso_length: number | null
          unit_preference: string | null
          updated_at: string
          user_id: string
          waist_circumference: number | null
        }
        Insert: {
          arm_length?: number | null
          bicep_circumference?: number | null
          chest_circumference?: number | null
          created_at?: string
          hip_circumference?: number | null
          id?: string
          inseam_length?: number | null
          neck_circumference?: number | null
          shoulder_width?: number | null
          thigh_circumference?: number | null
          torso_length?: number | null
          unit_preference?: string | null
          updated_at?: string
          user_id: string
          waist_circumference?: number | null
        }
        Update: {
          arm_length?: number | null
          bicep_circumference?: number | null
          chest_circumference?: number | null
          created_at?: string
          hip_circumference?: number | null
          id?: string
          inseam_length?: number | null
          neck_circumference?: number | null
          shoulder_width?: number | null
          thigh_circumference?: number | null
          torso_length?: number | null
          unit_preference?: string | null
          updated_at?: string
          user_id?: string
          waist_circumference?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          terms_accepted_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          terms_accepted_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          terms_accepted_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_style_profiles: {
        Row: {
          created_at: string
          dream_brands: string[] | null
          id: string
          style_tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dream_brands?: string[] | null
          id?: string
          style_tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dream_brands?: string[] | null
          id?: string
          style_tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      visual_searches: {
        Row: {
          analysis_data: Json | null
          attributes: Json | null
          created_at: string
          crop_data: Json | null
          embedding: string | null
          id: string
          image_url: string
          status: Database["public"]["Enums"]["search_status"]
          updated_at: string
          user_id: string
          user_image_id: string | null
        }
        Insert: {
          analysis_data?: Json | null
          attributes?: Json | null
          created_at?: string
          crop_data?: Json | null
          embedding?: string | null
          id?: string
          image_url: string
          status?: Database["public"]["Enums"]["search_status"]
          updated_at?: string
          user_id: string
          user_image_id?: string | null
        }
        Update: {
          analysis_data?: Json | null
          attributes?: Json | null
          created_at?: string
          crop_data?: Json | null
          embedding?: string | null
          id?: string
          image_url?: string
          status?: Database["public"]["Enums"]["search_status"]
          updated_at?: string
          user_id?: string
          user_image_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visual_searches_user_image_id_fkey"
            columns: ["user_image_id"]
            isOneToOne: false
            referencedRelation: "user_images"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_active_customer_count: {
        Args: { thrifter_uuid: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "customer" | "thrifter"
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
      app_role: ["customer", "thrifter"],
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
