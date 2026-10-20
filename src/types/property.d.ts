import type { Database } from "./database.types.js";

type PropertyKind = "apartment" | "villa" | "cabin";

type Property = Database["public"]["Tables"]["properties"]["Row"];

type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];

type NewProperty = Omit<
  PropertyInsert,
  "user_id" | "property_id" | "created_at" | "kind"
> & {
  user_id: string;
  kind: PropertyKind;
};

type PropertyValidKey = keyof Property;

type PropertySortBy = "title" | "city" | "price_per_night" | "created_at";
type SortOrder = "asc" | "desc";

type PropertyListFilter = {
  limit: number;
  offset: number;
  city?: string;
  max_guests?: number;
  min_price?: number;
  max_price?: number;
  q?: string;
  sort_by: PropertySortBy;
  sort_order: SortOrder;
};