import type { Database } from "./database.types.js";

type PropertyKind = "apartment" | "villa";

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