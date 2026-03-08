export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      collections: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          cultural_story: string | null;
          image_url: string | null;
          images_urls: string[] | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          cultural_story?: string | null;
          image_url?: string | null;
          images_urls?: string[] | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          cultural_story?: string | null;
          image_url?: string | null;
          images_urls?: string[] | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          cultural_story: string | null;
          price: number;
          discount_percentage: number;
          category_id: string | null;
          collection_id: string | null;
          fabric_type: string | null;
          available_sizes: string[];
          is_featured: boolean;
          is_new: boolean;
          early_bird_eligible: boolean;
          stock_quantity: number;
          is_published: boolean;
          seo_title: string | null;
          seo_description: string | null;
          size_guide_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          cultural_story?: string | null;
          price: number;
          discount_percentage?: number;
          category_id?: string | null;
          collection_id?: string | null;
          fabric_type?: string | null;
          available_sizes?: string[];
          is_featured?: boolean;
          is_new?: boolean;
          early_bird_eligible?: boolean;
          stock_quantity?: number;
          is_published?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          size_guide_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          cultural_story?: string | null;
          price?: number;
          discount_percentage?: number;
          category_id?: string | null;
          collection_id?: string | null;
          fabric_type?: string | null;
          available_sizes?: string[];
          is_featured?: boolean;
          is_new?: boolean;
          early_bird_eligible?: boolean;
          stock_quantity?: number;
          is_published?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          size_guide_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          position: number;
          is_primary: boolean;
        };
        Insert: {
          id?: string;
          product_id: string;
          image_url: string;
          position?: number;
          is_primary?: boolean;
        };
        Update: {
          id?: string;
          product_id?: string;
          image_url?: string;
          position?: number;
          is_primary?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          shipping_address: string;
          shipping_city: string;
          shipping_state: string | null;
          shipping_zip: string | null;
          shipping_country: string;
          total_amount: number;
          discount_code: string | null;
          discount_amount: number;
          status:
            | "pending"
            | "paid"
            | "processing"
            | "shipped"
            | "out_for_delivery"
            | "delivered"
            | "cancelled";
          payment_status: "pending" | "paid" | "failed" | "refunded";
          tracking_note: string | null;
          estimated_delivery: string | null;
          notes: string | null;
          user_id: string | null;
          payment_method: "cod" | "card" | "momo" | null;
          paystack_reference: string | null;
          paid_at: string | null;
          payment_verified: boolean;
          delivery_payment_collected: boolean;
          tracking_number: string | null;
          created_at: string;
          updated_at: string;
          campaign_id: string | null;
          discount_code_used: string | null; // DEPRECATED: Use discount_code instead
          source: string | null;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_email: string;
          customer_phone?: string | null;
          shipping_address: string;
          shipping_city: string;
          shipping_state?: string | null;
          shipping_zip?: string | null;
          shipping_country?: string;
          total_amount: number;
          discount_code?: string | null;
          discount_amount?: number;
          status?:
            | "pending"
            | "paid"
            | "processing"
            | "shipped"
            | "out_for_delivery"
            | "delivered"
            | "cancelled";
          payment_status?: "pending" | "paid" | "failed" | "refunded";
          tracking_note?: string | null;
          estimated_delivery?: string | null;
          notes?: string | null;
          user_id?: string | null;
          payment_method?: "cod" | "card" | "momo" | null;
          paystack_reference?: string | null;
          paid_at?: string | null;
          payment_verified?: boolean;
          delivery_payment_collected?: boolean;
          tracking_number?: string | null;
          created_at?: string;
          updated_at?: string;
          campaign_id?: string | null;
          discount_code_used?: string | null;
          source?: string | null;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string | null;
          shipping_address?: string;
          shipping_city?: string;
          shipping_state?: string | null;
          shipping_zip?: string | null;
          shipping_country?: string;
          total_amount?: number;
          discount_code?: string | null;
          discount_amount?: number;
          status?:
            | "pending"
            | "paid"
            | "processing"
            | "shipped"
            | "out_for_delivery"
            | "delivered"
            | "cancelled";
          payment_status?: "pending" | "paid" | "failed" | "refunded";
          tracking_note?: string | null;
          estimated_delivery?: string | null;
          notes?: string | null;
          user_id?: string | null;
          payment_method?: "cod" | "card" | "momo" | null;
          paystack_reference?: string | null;
          paid_at?: string | null;
          payment_verified?: boolean;
          delivery_payment_collected?: boolean;
          created_at?: string;
          updated_at?: string;
          campaign_id?: string | null;
          discount_code_used?: string | null;
          source?: string | null;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          size: string;
          price: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          quantity?: number;
          size: string;
          price: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          product_name?: string;
          quantity?: number;
          size?: string;
          price?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      discount_codes: {
        Row: {
          id: string;
          code: string;
          percentage: number;
          expiry_date: string | null;
          is_active: boolean;
          usage_count: number;
          max_uses: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          percentage: number;
          expiry_date?: string | null;
          is_active?: boolean;
          usage_count?: number;
          max_uses?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          percentage?: number;
          expiry_date?: string | null;
          is_active?: boolean;
          usage_count?: number;
          max_uses?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      admin_users: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          role: "admin" | "customer";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          role?: "admin" | "customer";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: "admin" | "customer";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          phone: string;
          address_line_1: string;
          address_line_2: string | null;
          city: string;
          region: string | null;
          country: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          phone: string;
          address_line_1: string;
          address_line_2?: string | null;
          city: string;
          region?: string | null;
          country?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          phone?: string;
          address_line_1?: string;
          address_line_2?: string | null;
          city?: string;
          region?: string | null;
          country?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_messages: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          subject: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone?: string | null;
          subject: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          subject?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      whatsapp_orders: {
        Row: {
          id: string;
          user_id: string | null;
          guest_name: string | null;
          guest_email: string | null;
          guest_phone: string | null;
          cart_snapshot: Json;
          total_amount: number;
          order_ref: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          guest_name?: string | null;
          guest_email?: string | null;
          guest_phone?: string | null;
          cart_snapshot: Json;
          total_amount: number;
          order_ref: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          guest_name?: string | null;
          guest_email?: string | null;
          guest_phone?: string | null;
          cart_snapshot?: Json;
          total_amount?: number;
          order_ref?: string;
          status?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "whatsapp_orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      wishlists: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wishlists_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wishlists_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          rating: number;
          comment: string | null;
          image_url: string | null;
          is_approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
          rating: number;
          comment?: string | null;
          image_url?: string | null;
          is_approved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string;
          rating?: number;
          comment?: string | null;
          image_url?: string | null;
          is_approved?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      size_guides: {
        Row: {
          id: string;
          title: string;
          content_html: string;
          category: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content_html: string;
          category?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content_html?: string;
          category?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      subscribers: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          source: string | null;
          tags: string[] | null;
          is_subscribed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          source?: string | null;
          tags?: string[] | null;
          is_subscribed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          source?: string | null;
          tags?: string[] | null;
          is_subscribed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      campaigns: {
        Row: {
          id: string;
          name: string;
          subject_line: string;
          preview_text: string | null;
          content_html: string;
          segment_id: string | null;
          status: string;
          scheduled_at: string | null;
          sent_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          subject_line: string;
          preview_text?: string | null;
          content_html: string;
          segment_id?: string | null;
          status?: string;
          scheduled_at?: string | null;
          sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          subject_line?: string;
          preview_text?: string | null;
          content_html?: string;
          segment_id?: string | null;
          status?: string;
          scheduled_at?: string | null;
          sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      automations: {
        Row: {
          id: string;
          name: string;
          trigger_event: string;
          active: boolean;
          trigger_conditions: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          trigger_event: string;
          active?: boolean;
          trigger_conditions?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          trigger_event?: string;
          active?: boolean;
          trigger_conditions?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      automation_emails: {
        Row: {
          id: string;
          automation_id: string | null;
          delay_minutes: number;
          subject_line: string;
          content_html: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          automation_id?: string | null;
          delay_minutes?: number;
          subject_line: string;
          content_html: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          automation_id?: string | null;
          delay_minutes?: number;
          subject_line?: string;
          content_html?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "automation_emails_automation_id_fkey";
            columns: ["automation_id"];
            isOneToOne: false;
            referencedRelation: "automations";
            referencedColumns: ["id"];
          },
        ];
      };
      marketing_popups: {
        Row: {
          id: string;
          name: string;
          type: string;
          title: string;
          content: string | null;
          image_url: string | null;
          cta_label: string | null;
          cta_url: string | null;
          discount_code: string | null;
          delay_seconds: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          title: string;
          content?: string | null;
          image_url?: string | null;
          cta_label?: string | null;
          cta_url?: string | null;
          discount_code?: string | null;
          delay_seconds?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          title?: string;
          content?: string | null;
          image_url?: string | null;
          cta_label?: string | null;
          cta_url?: string | null;
          discount_code?: string | null;
          delay_seconds?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "marketing_popups_discount_code_fkey";
            columns: ["discount_code"];
            isOneToOne: false;
            referencedRelation: "discount_codes";
            referencedColumns: ["code"];
          },
        ];
      };
      automation_logs: {
        Row: {
          id: string;
          automation_id: string | null;
          email_id: string | null;
          subscriber_email: string;
          status: string | null;
          scheduled_at: string | null;
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          automation_id?: string | null;
          email_id?: string | null;
          subscriber_email: string;
          status?: string | null;
          scheduled_at?: string | null;
          sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          automation_id?: string | null;
          email_id?: string | null;
          subscriber_email?: string;
          status?: string | null;
          scheduled_at?: string | null;
          sent_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "automation_logs_automation_id_fkey";
            columns: ["automation_id"];
            isOneToOne: false;
            referencedRelation: "automations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "automation_logs_email_id_fkey";
            columns: ["email_id"];
            isOneToOne: false;
            referencedRelation: "automation_emails";
            referencedColumns: ["id"];
          },
        ];
      };
      fabric_types: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      instagram_posts: {
        Row: {
          id: string;
          image_url: string;
          post_url: string;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          post_url: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string;
          post_url?: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          value: Json;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      verification_codes: {
        Row: {
          id: string;
          user_id: string;
          code: string;
          type: "email_change" | "password_change";
          metadata: Json;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          code: string;
          type: "email_change" | "password_change";
          metadata?: Json;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          code?: string;
          type?: "email_change" | "password_change";
          metadata?: Json;
          expires_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "verification_codes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_discount_usage: {
        Args: {
          code_to_increment: string;
        };
        Returns: void;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// ── Convenience type aliases ────────────────────────────────────────

type Tables = Database["public"]["Tables"];

export type Collection = Tables["collections"]["Row"];
export type Category = Tables["categories"]["Row"];
export type Product = Tables["products"]["Row"];
export type ProductImage = Tables["product_images"]["Row"];
export type Order = Tables["orders"]["Row"];
export type OrderItem = Tables["order_items"]["Row"];
export type DiscountCode = Tables["discount_codes"]["Row"];
export type AdminUser = Tables["admin_users"]["Row"];
export type Profile = Tables["profiles"]["Row"];
export type Address = Tables["addresses"]["Row"];
export type ContactMessage = Tables["contact_messages"]["Row"];
export type WhatsAppOrder = Tables["whatsapp_orders"]["Row"];
export type FabricType = Tables["fabric_types"]["Row"];
export type InstagramPost = Tables["instagram_posts"]["Row"];
export type SiteSetting = Tables["site_settings"]["Row"];
export type VerificationCode = Tables["verification_codes"]["Row"];
// ── Composite types (with joins) ────────────────────────────────────

export interface ProductWithImages extends Product {
  product_images: ProductImage[];
  category: Category | null;
  collection: Collection | null;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export interface OrderWithItemsAndUser extends OrderWithItems {
  profiles?: {
    full_name: string | null;
    email: string | null;
  } | null;
}

// ── Cart types (client-side) ────────────────────────────────────────

export interface CartItem {
  product_id: string;
  name: string;
  slug: string;
  price: number;
  discount_percentage: number;
  image_url: string;
  size: string;
  quantity: number;
  stock_quantity: number;
}
