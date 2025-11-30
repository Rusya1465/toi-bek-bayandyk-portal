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
      artists: {
        Row: {
          contacts: string | null
          contacts_kg: string | null
          contacts_ru: string | null
          created_at: string
          description: string | null
          description_kg: string | null
          description_ru: string | null
          experience: string | null
          experience_kg: string | null
          experience_ru: string | null
          genre: string | null
          genre_kg: string | null
          genre_ru: string | null
          id: string
          image_url: string | null
          name: string
          name_kg: string | null
          name_ru: string | null
          owner_id: string
          price: string | null
          price_kg: string | null
          price_ru: string | null
          rating: number | null
          updated_at: string
        }
        Insert: {
          contacts?: string | null
          contacts_kg?: string | null
          contacts_ru?: string | null
          created_at?: string
          description?: string | null
          description_kg?: string | null
          description_ru?: string | null
          experience?: string | null
          experience_kg?: string | null
          experience_ru?: string | null
          genre?: string | null
          genre_kg?: string | null
          genre_ru?: string | null
          id?: string
          image_url?: string | null
          name: string
          name_kg?: string | null
          name_ru?: string | null
          owner_id: string
          price?: string | null
          price_kg?: string | null
          price_ru?: string | null
          rating?: number | null
          updated_at?: string
        }
        Update: {
          contacts?: string | null
          contacts_kg?: string | null
          contacts_ru?: string | null
          created_at?: string
          description?: string | null
          description_kg?: string | null
          description_ru?: string | null
          experience?: string | null
          experience_kg?: string | null
          experience_ru?: string | null
          genre?: string | null
          genre_kg?: string | null
          genre_ru?: string | null
          id?: string
          image_url?: string | null
          name?: string
          name_kg?: string | null
          name_ru?: string | null
          owner_id?: string
          price?: string | null
          price_kg?: string | null
          price_ru?: string | null
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      places: {
        Row: {
          address: string | null
          address_kg: string | null
          address_ru: string | null
          capacity: string | null
          capacity_kg: string | null
          capacity_ru: string | null
          contacts: string | null
          contacts_kg: string | null
          contacts_ru: string | null
          created_at: string
          description: string | null
          description_kg: string | null
          description_ru: string | null
          id: string
          image_url: string | null
          name: string
          name_kg: string | null
          name_ru: string | null
          owner_id: string
          price: string | null
          price_kg: string | null
          price_ru: string | null
          rating: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          address_kg?: string | null
          address_ru?: string | null
          capacity?: string | null
          capacity_kg?: string | null
          capacity_ru?: string | null
          contacts?: string | null
          contacts_kg?: string | null
          contacts_ru?: string | null
          created_at?: string
          description?: string | null
          description_kg?: string | null
          description_ru?: string | null
          id?: string
          image_url?: string | null
          name: string
          name_kg?: string | null
          name_ru?: string | null
          owner_id: string
          price?: string | null
          price_kg?: string | null
          price_ru?: string | null
          rating?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          address_kg?: string | null
          address_ru?: string | null
          capacity?: string | null
          capacity_kg?: string | null
          capacity_ru?: string | null
          contacts?: string | null
          contacts_kg?: string | null
          contacts_ru?: string | null
          created_at?: string
          description?: string | null
          description_kg?: string | null
          description_ru?: string | null
          id?: string
          image_url?: string | null
          name?: string
          name_kg?: string | null
          name_ru?: string | null
          owner_id?: string
          price?: string | null
          price_kg?: string | null
          price_ru?: string | null
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      rentals: {
        Row: {
          contacts: string | null
          contacts_kg: string | null
          contacts_ru: string | null
          created_at: string
          description: string | null
          description_kg: string | null
          description_ru: string | null
          id: string
          image_url: string | null
          name: string
          name_kg: string | null
          name_ru: string | null
          owner_id: string
          price: string | null
          price_kg: string | null
          price_ru: string | null
          rating: number | null
          specs: string | null
          specs_kg: string | null
          specs_ru: string | null
          updated_at: string
        }
        Insert: {
          contacts?: string | null
          contacts_kg?: string | null
          contacts_ru?: string | null
          created_at?: string
          description?: string | null
          description_kg?: string | null
          description_ru?: string | null
          id?: string
          image_url?: string | null
          name: string
          name_kg?: string | null
          name_ru?: string | null
          owner_id: string
          price?: string | null
          price_kg?: string | null
          price_ru?: string | null
          rating?: number | null
          specs?: string | null
          specs_kg?: string | null
          specs_ru?: string | null
          updated_at?: string
        }
        Update: {
          contacts?: string | null
          contacts_kg?: string | null
          contacts_ru?: string | null
          created_at?: string
          description?: string | null
          description_kg?: string | null
          description_ru?: string | null
          id?: string
          image_url?: string | null
          name?: string
          name_kg?: string | null
          name_ru?: string | null
          owner_id?: string
          price?: string | null
          price_kg?: string | null
          price_ru?: string | null
          rating?: number | null
          specs?: string | null
          specs_kg?: string | null
          specs_ru?: string | null
          updated_at?: string
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
