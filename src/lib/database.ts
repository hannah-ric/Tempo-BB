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
export async function saveBuildPlan(buildPlan: any, userId?: string) {
  // Get the current user ID from the session if not provided
  if (!userId) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    userId = session?.user?.id || "anonymous";
  }

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
      // Only allow updates if the user owns the plan or if it's an anonymous plan
      .or(`user_id.eq.${userId},user_id.eq.anonymous`)
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
          user_id: userId,
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

export async function getUserBuildPlans(userId?: string) {
  // Get the current user ID from the session if not provided
  if (!userId) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    userId = session?.user?.id;
  }

  // If we have a user ID, fetch their plans, otherwise fetch anonymous plans
  const query = supabase
    .from("build_plans")
    .select("*")
    .order("created_at", { ascending: false });

  if (userId) {
    // Get plans owned by this user or anonymous plans
    query.or(`user_id.eq.${userId},user_id.eq.anonymous`);
  } else {
    // Only get anonymous plans if no user is logged in
    query.eq("user_id", "anonymous");
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching user build plans:", error);
    return [];
  }

  return data;
}

export async function deleteBuildPlan(id: string, userId?: string) {
  // Get the current user ID from the session if not provided
  if (!userId) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    userId = session?.user?.id;
  }

  // Only allow deletion if the user owns the plan or if it's an anonymous plan
  const query = supabase.from("build_plans").delete();

  if (userId) {
    query.eq("id", id).or(`user_id.eq.${userId},user_id.eq.anonymous`);
  } else {
    // If no user is logged in, only allow deletion of anonymous plans
    query.eq("id", id).eq("user_id", "anonymous");
  }

  const { error } = await query;

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
