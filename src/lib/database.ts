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

// Build plan functions
export async function saveBuildPlan(buildPlan: any) {
  // Check if this is an update to an existing plan
  if (buildPlan.id) {
    const { data, error } = await supabase
      .from("build_plans")
      .update({
        plan_name: buildPlan.planName || "Untitled Plan",
        design_brief: buildPlan.designBrief,
        plan_data: buildPlan,
        status: buildPlan.status || "Draft",
        version: (buildPlan.version || 1) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", buildPlan.id)
      .select();

    if (error) {
      console.error(`Error updating build plan ${buildPlan.id}:`, error);
      return null;
    }

    return data[0];
  } else {
    // This is a new plan
    const { data, error } = await supabase
      .from("build_plans")
      .insert([
        {
          user_id: "system", // Replace with actual user ID when auth is implemented
          plan_name: buildPlan.planName || "Untitled Plan",
          design_brief: buildPlan.designBrief,
          plan_data: buildPlan,
          status: buildPlan.status || "Draft",
          version: buildPlan.version || 1,
        },
      ])
      .select();

    if (error) {
      console.error("Error saving build plan:", error);
      return null;
    }

    return data[0];
  }
}

export async function getBuildPlan(id: string) {
  const { data, error } = await supabase
    .from("build_plans")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching build plan ${id}:`, error);
    return null;
  }

  return data;
}

export async function getUserBuildPlans() {
  const { data, error } = await supabase
    .from("build_plans")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user build plans:", error);
    return [];
  }

  return data;
}

export async function deleteBuildPlan(id: string) {
  const { error } = await supabase.from("build_plans").delete().eq("id", id);

  if (error) {
    console.error(`Error deleting build plan ${id}:`, error);
    return false;
  }

  return true;
}

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
