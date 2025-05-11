import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

// Define the handler for the Supabase Edge Function
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
      status: 200,
    });
  }

  try {
    // Get the Supabase client using environment variables
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_KEY") ?? "",
    );

    // Furniture components data
    const furnitureComponents = [
      {
        component: "Chair",
        subtype: "dining chair",
        dimensions: {
          seat_height: { in: 18, mm: 457 },
          seat_depth: { in: 16, mm: 406 },
          seat_width: { in: 18, mm: 457 },
          back_height: { in: 32, mm: 813 },
          armrest_height: { in: 25, mm: 635 },
          leg_thickness: { in: 1.5, mm: 38 },
          overall_width: { in: 18, mm: 457 },
          overall_depth: { in: 20, mm: 508 },
        },
        tolerances:
          "±0.25 in for seat and back dimensions; ergonomic guidelines follow typical North American standards.",
        recommended_material:
          "Solid hardwood (e.g., Oak or Maple) or quality plywood for cost-effective builds.",
        typical_uses: [
          "Chair Seat",
          "Chair Leg",
          "Chair Backrest",
          "Chair Armrest",
        ],
        notes:
          "Standard dining chairs: seat height ~18 in, ideal for average adult; back height around 32 in ensures support. Additional variants (e.g., lounge chairs, office chairs) may have adjusted dimensions.",
      },
      {
        component: "Chair",
        subtype: "lounge chair",
        dimensions: {
          seat_height: { in: 16, mm: 406 },
          seat_depth: { in: 20, mm: 508 },
          seat_width: { in: 22, mm: 559 },
          back_height: { in: 34, mm: 864 },
          armrest_height: { in: 24, mm: 610 },
          leg_thickness: { in: 2, mm: 51 },
        },
        tolerances:
          "Slight variations allowed ±0.5 in; lounge chairs tend to have deeper, wider seats.",
        recommended_material:
          "Typically solid wood with a veneer or upholstered seat.",
        typical_uses: [
          "Chair Seat",
          "Chair Leg",
          "Chair Backrest",
          "Chair Armrest",
        ],
        notes:
          "Lounge chairs are designed for relaxation; seating is often lower with a more reclined back.",
      },
      {
        component: "Desk",
        subtype: "standard office desk",
        dimensions: {
          height: { in: 29, mm: 737 },
          width: { in: 60, mm: 1524 },
          depth: { in: 30, mm: 762 },
          leg_thickness: { in: 2, mm: 51 },
          drawer_clearance: { in: 24, mm: 610 },
        },
        tolerances:
          "±0.5 in tolerance on overall dimensions; ergonomic guidelines (desktop ~29 in high) per interior design recommendations.",
        recommended_material:
          "Solid wood for premium desks or high-quality plywood/MDF with veneer for cost-effective solutions.",
        typical_uses: ["Desk Top", "Desk Leg", "Desk Drawer"],
        notes:
          "Standard desk height is ~29 in (desktop + leg assembly) to provide comfortable working ergonomics. Dimensions vary for L-shaped or executive desks.",
      },
      {
        component: "Dresser",
        subtype: "6-drawer dresser",
        dimensions: {
          overall_height: { in: 30, mm: 762 },
          overall_width: { in: 60, mm: 1524 },
          overall_depth: { in: 18, mm: 457 },
          drawer_height: { in: 6, mm: 152 },
          drawer_width: { in: 26, mm: 660 },
          drawer_depth: { in: 14, mm: 356 },
        },
        tolerances:
          "±0.25 in on drawer dimensions; overall tolerances ±0.5 in on external dimensions.",
        recommended_material:
          "Plywood or solid wood, depending on cost vs. appearance; often combined with veneer face frames.",
        typical_uses: ["Dresser Carcase", "Drawer Assembly", "Face Frame"],
        notes:
          "Popular dresser proportions vary slightly; a 6-drawer design is standard in many U.S. bedrooms.",
      },
      {
        component: "Bookshelf",
        subtype: "free-standing bookcase",
        dimensions: {
          overall_height: { in: 79.5, mm: 2021 },
          overall_width: { in: 30, mm: 762 },
          overall_depth: { in: 11, mm: 279 },
          shelf_thickness: { in: 0.75, mm: 19 },
          shelf_spacing: { in: 12, mm: 305 },
        },
        tolerances:
          "±0.5 in overall; shelf spacing can vary ±1 in to accommodate different book sizes.",
        recommended_material:
          "Baltic birch plywood for the carcass, with solid wood face frames for a higher-end look.",
        typical_uses: [
          "Bookshelf Side Panel",
          "Bookshelf Shelves",
          "Bookshelf Top/Bottom Panel",
        ],
        notes:
          "A typical free-standing bookcase (e.g., IKEA Billy) has dimensions roughly 80×30×11 in; shelf spacing is often adjustable.",
      },
      {
        component: "Armoire",
        subtype: "wardrobe",
        dimensions: {
          overall_height: { in: 72, mm: 1829 },
          overall_width: { in: 40, mm: 1020 },
          overall_depth: { in: 22, mm: 559 },
          door_height: { in: 60, mm: 1524 },
          door_width: { in: 20, mm: 508 },
          shelf_spacing: { in: 12, mm: 305 },
        },
        tolerances:
          "±0.5 in in critical dimensions; door overlay may vary ±0.25 in per side.",
        recommended_material:
          "High-quality plywood with veneer or solid wood face frame; side panels and doors should have tight tolerances.",
        typical_uses: ["Armoire Side Panel", "Armoire Door", "Armoire Shelf"],
        notes:
          "Wardrobes typically have full-height doors and adjustable shelves. Standard U.S. dimensions are used, though European styles may differ slightly.",
      },
      {
        component: "Bench",
        subtype: "park bench",
        dimensions: {
          overall_length: { in: 48, mm: 1219 },
          overall_depth: { in: 18, mm: 457 },
          seat_height: { in: 17, mm: 432 },
          backrest_height: { in: 20, mm: 508 },
          leg_thickness: { in: 2.5, mm: 64 },
        },
        tolerances:
          "±0.5 in overall; seat and backrest dimensions standard for public seating.",
        recommended_material:
          "Pressure-treated softwood for outdoor benches or solid hardwood for indoor design.",
        typical_uses: ["Bench Seat", "Bench Legs", "Bench Backrest"],
        notes:
          "Bench dimensions vary by design but a typical park bench is about 4 ft long and 17 in high at the seat.",
      },
      {
        component: "Bed Frame",
        subtype: "platform bed",
        dimensions: {
          overall_length: { in: 80, mm: 2032 },
          overall_width: { in: 60, mm: 1524 },
          headboard_height: { in: 36, mm: 914 },
          footboard_height: { in: 10, mm: 254 },
          side_panel_thickness: { in: 1.5, mm: 38 },
        },
        tolerances:
          "±1 in for overall dimensions; precise fit is important for mattress support.",
        recommended_material:
          "Solid hardwood or engineered wood with plywood core for cost and durability.",
        typical_uses: ["Bed Frame Side Panel", "Headboard", "Footboard"],
        notes:
          "Platform beds must support weight evenly over a large area; standard king/queen dimensions apply.",
      },
      {
        component: "Desk",
        subtype: "standing desk",
        dimensions: {
          height: { in: 42, mm: 1067 },
          width: { in: 48, mm: 1220 },
          depth: { in: 28, mm: 711 },
          leg_thickness: { in: 2.25, mm: 57 },
          drawer_clearance: { in: 18, mm: 457 },
        },
        tolerances:
          "±0.5 in overall; standing desks may vary based on ergonomics.",
        recommended_material:
          "Stable plywood carcass with solid wood accents; engineered wood works well.",
        typical_uses: ["Desk Top", "Desk Legs", "Desk Drawers"],
        notes:
          "Ergonomic standing desks are taller – usually about 42 in high. Dimensions follow ergonomic guidelines for alternate workstations.",
      },
    ];

    // Lumber materials data
    const lumberMaterials = [
      {
        nominal_size: "2x4",
        actual_size: { in: [1.5, 3.5], mm: [38, 89] },
        common_lengths: {
          imperial: [8, 10, 12, 14, 16],
          metric: [2438, 3048, 3658, 4267, 4877],
        },
        tolerances: "±0.125 in on actual dimensions due to planing variations",
        notes:
          "A standard 2x4 is used for framing; actual dimensions are approximately 1.5 × 3.5 inches.",
      },
      {
        nominal_size: "2x6",
        actual_size: { in: [1.5, 5.5], mm: [38, 140] },
        common_lengths: {
          imperial: [8, 10, 12, 14, 16],
          metric: [2438, 3048, 3658, 4267, 4877],
        },
        tolerances: "±0.125 in; subject to planing and drying shrinkage",
        notes: "Typically used for floor joists, rafters, and headers.",
      },
      {
        nominal_size: "1x4",
        actual_size: { in: [0.75, 3.5], mm: [19, 89] },
        common_lengths: {
          imperial: [6, 8, 10, 12],
          metric: [1829, 2438, 3048, 3658],
        },
        tolerances: "±0.0625 in on thickness due to planing",
        notes:
          "Commonly used for trim work, paneling, and decorative elements.",
      },
    ];

    // Sheet materials data
    const sheetMaterials = [
      {
        type: "Standard Plywood",
        nominal_sheet_size: { ft: [4, 8], mm: [1219, 2438] },
        thickness_options: [
          { in: 0.25, mm: 6 },
          { in: 0.5, mm: 12 },
          { in: 0.75, mm: 19 },
        ],
        tolerances: "Thickness can vary ±0.1 in; sheet dimensions ±0.25 in",
        notes:
          "Standard plywood sheets are used in cabinetry and structural panels.",
      },
      {
        type: "Baltic Birch Plywood",
        nominal_sheet_size: { ft: [5, 5], mm: [1524, 1524] },
        thickness_options: [
          { in: 0.25, mm: 6 },
          { in: 0.5, mm: 12 },
          { in: 0.75, mm: 19 },
        ],
        tolerances:
          "Dimensions are more uniform due to higher ply count; thickness variation ±0.05 in typical.",
        notes:
          "High-quality plywood with more plies and a uniform surface finish. Commonly used in fine cabinetry and furniture.",
      },
      {
        type: "MDF",
        nominal_sheet_size: { ft: [4, 8], mm: [1219, 2438] },
        thickness_options: [
          { in: 0.75, mm: 19 },
          { in: 1.0, mm: 25 },
          { in: 1.5, mm: 38 },
        ],
        tolerances: "Thickness ±0.05 in; dimensions may vary slightly.",
        notes:
          "Medium Density Fiberboard is smooth, ideal for painting; however, not water resistant.",
      },
    ];

    // Other materials data
    const otherMaterials = [
      {
        name: "Tempered Glass",
        type: "glass",
        density: {
          imperial: { value: 156, unit: "lb/ft³" },
          metric: { value: 2500, unit: "kg/m³" },
        },
        modulus_elasticity: {
          imperial: null,
          metric: { value: 70, unit: "GPa" },
        },
        notes:
          "Commonly used for table tops, shelf panels, and cabinet door inserts. Often available in standard sheet sizes such as 4' x 8' (1219 x 2438 mm) and can be cut to custom dimensions. Thickness typically 1/4\" (6 mm) or 3/8\" (10 mm).",
      },
      {
        name: "Acrylic Sheet",
        type: "acrylic",
        density: {
          imperial: { value: 74, unit: "lb/ft³" },
          metric: { value: 1180, unit: "kg/m³" },
        },
        modulus_elasticity: {
          imperial: null,
          metric: { value: 3.0, unit: "GPa" },
        },
        notes:
          'Used for transparent furniture elements, such as table tops or decorative panels. Standard sheet sizes include 4\' x 8\' (1219 x 2438 mm) with thickness options of 1/4", 1/2", and 3/4" (6, 12, 19 mm).',
      },
      {
        name: "Stainless Steel",
        type: "metal",
        density: {
          imperial: { value: 490, unit: "lb/ft³" },
          metric: { value: 8000, unit: "kg/m³" },
        },
        modulus_elasticity: {
          imperial: null,
          metric: { value: 193, unit: "GPa" },
        },
        notes:
          "Used in structural elements such as fasteners, brackets, and frames, particularly in contemporary or industrial furniture. Available in standard bar, tube, and sheet dimensions. Standard sheet sizes vary, with common thicknesses of 1–3 mm for decorative panels and 6–12 mm for structural parts.",
      },
    ];

    // Insert data into tables
    const { error: componentsError } = await supabaseClient
      .from("furniture_components")
      .insert(furnitureComponents);

    if (componentsError) {
      throw new Error(
        `Error inserting furniture components: ${componentsError.message}`,
      );
    }

    const { error: lumberError } = await supabaseClient
      .from("lumber_materials")
      .insert(lumberMaterials);

    if (lumberError) {
      throw new Error(
        `Error inserting lumber materials: ${lumberError.message}`,
      );
    }

    const { error: sheetError } = await supabaseClient
      .from("sheet_materials")
      .insert(sheetMaterials);

    if (sheetError) {
      throw new Error(`Error inserting sheet materials: ${sheetError.message}`);
    }

    const { error: otherError } = await supabaseClient
      .from("other_materials")
      .insert(otherMaterials);

    if (otherError) {
      throw new Error(`Error inserting other materials: ${otherError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Database populated successfully",
        counts: {
          furnitureComponents: furnitureComponents.length,
          lumberMaterials: lumberMaterials.length,
          sheetMaterials: sheetMaterials.length,
          otherMaterials: otherMaterials.length,
        },
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 500,
      },
    );
  }
});
