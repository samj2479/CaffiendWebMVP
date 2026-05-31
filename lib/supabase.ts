import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  temp?: "HOT" | "ICE" | null;
  note?: string;
}

export interface Order {
  id: string;
  table_number: number;
  items: OrderItem[];
  status: "pending" | "cooking" | "completed" | "cancelled";
  created_at: string;
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase: SupabaseClient | null =
  url.startsWith("http") ? createClient(url, key) : null;
