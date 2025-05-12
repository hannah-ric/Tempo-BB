import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";
import { FurnitureDesignBrief } from "../_shared/types.ts";

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
    const { prompt, designBrief } = await req.json();

    if (!prompt || !designBrief) {
      return new Response(
        JSON.stringify({
          error: "Missing required parameters: prompt and designBrief",
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          status: 400,
        },
      );
    }

    // Get the Supabase client using environment variables
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_KEY") ?? "",
    );

    // Get the OpenAI API key from environment variables
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    // Call the OpenAI API
    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "You are an expert furniture designer and woodworker with decades of experience. Your task is to generate comprehensive, professional-grade furniture build plans based on user descriptions. Your plans should include:
                
                1. Precise dimensions with appropriate tolerances for each component
                2. Material specifications including species, grade, and finish recommendations
                3. Detailed joinery methods appropriate for the furniture type and load requirements
                4. Complete cut lists with grain direction considerations
                5. Hardware specifications with exact sizes and quantities
                6. Step-by-step assembly instructions with clear ordering
                7. Finishing recommendations
                
                Consider ergonomics, structural integrity, wood movement, and aesthetic balance in your designs. For tables, follow standard height guidelines (dining: 30", coffee: 16-18", end: 24-26"). For chairs, consider seat height (17-19"), width (minimum 18"), and depth (16-18"). For cabinets and storage, use standard depths (12-24") and heights based on use case.
                
                Provide all measurements in the units specified by the user, or in inches if not specified. Format dimensions consistently as length × width × thickness.
                
                Return your response as a structured JSON object that follows the schema requirements exactly.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.5,
          max_tokens: 4000,
          response_format: { type: "json_object" },
        }),
      },
    );

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      throw new Error(
        `OpenAI API error: ${openaiResponse.status} ${errorText}`,
      );
    }

    const openaiData = await openaiResponse.json();
    const buildPlanJson = JSON.parse(openaiData.choices[0].message.content);

    // Store the generated build plan in the database
    const { data: savedPlan, error: saveError } = await supabaseClient
      .from("build_plans")
      .insert([
        {
          user_id: "system", // Replace with actual user ID in production
          plan_name:
            buildPlanJson.planName ||
            `Plan for ${designBrief.description.substring(0, 30)}`,
          design_brief: designBrief,
          plan_data: buildPlanJson,
          status: "Draft",
          version: 1,
        },
      ])
      .select()
      .single();

    if (saveError) {
      console.error("Error saving build plan to database:", saveError);
      // Continue anyway, just log the error
    }

    // Return the build plan
    return new Response(
      JSON.stringify({
        success: true,
        buildPlan: buildPlanJson,
        savedPlanId: savedPlan?.id,
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
    console.error("Error in generate_furniture_plan:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
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
