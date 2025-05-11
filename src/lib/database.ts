import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";
import {
  FurnitureComponent,
  LumberMaterial,
  SheetMaterial,
  OtherMaterial,
} from "../types/furniture";

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Furniture component functions
export async function getFurnitureComponents() {
  const { data, error } = await supabase
    .from("furniture_components")
    .select("*");

  if (error) {
    console.error("Error fetching furniture components:", error);
    return [];
  }

  return data as FurnitureComponent[];
}

export async function getFurnitureComponentsByType(componentType: string) {
  const { data, error } = await supabase
    .from("furniture_components")
    .select("*")
    .eq("component", componentType);

  if (error) {
    console.error(`Error fetching ${componentType} components:`, error);
    return [];
  }

  return data as FurnitureComponent[];
}

// Material functions
export async function getLumberMaterials() {
  const { data, error } = await supabase.from("lumber_materials").select("*");

  if (error) {
    console.error("Error fetching lumber materials:", error);
    return [];
  }

  return data as LumberMaterial[];
}

export async function getSheetMaterials() {
  const { data, error } = await supabase.from("sheet_materials").select("*");

  if (error) {
    console.error("Error fetching sheet materials:", error);
    return [];
  }

  return data as SheetMaterial[];
}

export async function getOtherMaterials() {
  const { data, error } = await supabase.from("other_materials").select("*");

  if (error) {
    console.error("Error fetching other materials:", error);
    return [];
  }

  return data as OtherMaterial[];
}
