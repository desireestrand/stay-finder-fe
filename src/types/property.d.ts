import type { Database } from "./database.types.js";

export type PropertyKind = "apartment" | "villa" | "cabin";

export type Property = Database["public"]["Tables"]["properties"]["Row"];

export type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];

export type NewProperty = Omit<
  PropertyInsert,
  "user_id" | "property_id" | "created_at" | "kind"
> & {
  user_id: string;
  kind: PropertyKind;
};

export type PropertyValidKey = keyof Property;

export type PropertySortBy = "title" | "city" | "price_per_night" | "created_at";
export type SortOrder = "asc" | "desc";

export type PropertyListFilter = {
  limit: number;
  offset: number;
  city?: string;
  max_guests?: number;
  min_price?: number;
  max_price?: number;
  q?: string;
  sort_by: PropertySortBy;
  sort_order: SortOrder;
  start_date?: string;
  end_date?: string;
};