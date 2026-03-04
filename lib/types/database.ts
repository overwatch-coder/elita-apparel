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
          status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
          notes: string | null;
          created_at: string;
          updated_at: string;
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
          status?: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
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
          status?: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
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
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
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

// ── Composite types (with joins) ────────────────────────────────────

export interface ProductWithImages extends Product {
  product_images: ProductImage[];
  category: Category | null;
  collection: Collection | null;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
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
