import { z } from 'zod';
import {
  FurnitureDesignBrief,
  BuildPlan,
  ComponentModel,
  MaterialModel,
  HardwareModel,
  JoineryModel,
  CutListItem,
  BillOfMaterialsItem,
  AssemblyStep,
} from '../src/types/design';

// Zod Schemas for validation

export const FurnitureDesignBriefSchema = z.object({
  description: z.string(),
  style: z.string().optional(),
  targetDimensions: z.object({
    length: z.string().optional(),
    width: z.string().optional(),
    height: z.string().optional(),
    depth: z.string().optional(),
    units: z.enum(["in", "cm", "mm"]).optional(),
  }).optional(),
  material: z.string().optional(),
}).strict();

export const ComponentModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number(),
  dimensions: z.string(),
  materialId: z.string().optional(),
  description: z.string().optional(),
  tolerance: z.string().optional(),
}).strict();

export const MaterialModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["Lumber", "SheetGood", "Hardware", "Other"]),
  grade: z.string().optional(),
  finish: z.string().optional(),
  vendor: z.string().optional(),
  sku: z.string().optional(),
  pricePerUnit: z.number().optional(),
  unit: z.string().optional(),
  mechanicalProperties: z.record(z.string()).optional(),
}).strict();

export const HardwareModelSchema = MaterialModelSchema.extend({
  type: z.literal("Hardware"),
  size: z.string().optional(),
  material: z.string().optional(),
});

export const JoineryModelSchema = z.object({
  id: z.string(),
  type: z.string(),
  strengthRating: z.number().optional(),
  description: z.string().optional(),
  compatibleMaterials: z.array(z.string()).optional(),
  compatibleThickness: z.string().optional(),
  requiredTools: z.array(z.string()).optional(),
}).strict();

export const CutListItemSchema = z.object({
  id: z.string(),
  componentName: z.string(),
  partName: z.string(),
  quantity: z.number(),
  length: z.string(),
  width: z.string(),
  thickness: z.string(),
  material: z.string(),
  grainDirection: z.enum(["Parallel", "Perpendicular", "Any"]).optional(),
  notes: z.string().optional(),
}).strict();

export const BillOfMaterialsItemSchema = z.object({
  id: z.string(),
  itemId: z.string(),
  itemName: z.string(),
  itemType: z.enum(["Material", "Hardware", "Other"]),
  quantity: z.number(),
  unitCost: z.number().optional(),
  totalCost: z.number().optional(),
  supplier: z.string().optional(),
  notes: z.string().optional(),
}).strict();

export const AssemblyStepSchema = z.object({
  stepNumber: z.number(),
  title: z.string(),
  description: z.string(),
  componentsInvolved: z.array(z.string()),
  joineryUsed: z.array(z.string()).optional(),
  hardwareUsed: z.array(z.string()).optional(),
  toolsRequired: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
  estimatedTime: z.string().optional(),
}).strict();

export const BuildPlanSchema = z.object({
  id: z.string(),
  userId: z.string(),
  planName: z.string(),
  designBrief: FurnitureDesignBriefSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  components: z.array(ComponentModelSchema),
  materials: z.array(MaterialModelSchema),
  hardware: z.array(HardwareModelSchema),
  joinery: z.array(JoineryModelSchema),
  cutList: z.array(CutListItemSchema),
  billOfMaterials: z.array(BillOfMaterialsItemSchema),
  assemblyInstructions: z.array(AssemblyStepSchema),
  modelUrl: z.string().url().optional(),
  explodedModelUrl: z.string().url().optional(),
  status: z.enum(["Draft", "PendingReview", "Approved", "Archived"]),
  version: z.number(),
  notes: z.string().optional(),
  dxfUrl: z.string().url().optional(),
  camInstructions: z.string().optional(),
  estimatedCost: z.number().optional(),
  supplierQuotes: z.array(z.object({
    supplierId: z.string(),
    quoteId: z.string(),
    totalCost: z.number(),
    leadTime: z.string(),
  }).strict()).optional(),
}).strict();

/**
 * Generates a BuildPlan from a FurnitureDesignBrief using an AI model.
 * Currently, this function simulates an AI response and validates it.
 * 
 * @param brief The FurnitureDesignBrief object.
 * @returns A Promise that resolves to a BuildPlan object if successful, or null otherwise.
 */
export async function generatePlanFromBrief(
  brief: FurnitureDesignBrief
): Promise<BuildPlan | null> {
  console.log("AI Planner Service: Received brief:", brief);

  // 1. Construct a detailed prompt for the AI (GPT-4o)
  // This will involve taking the brief and formatting it, along with instructions
  // for the AI to return a JSON object matching the BuildPlanSchema.
  // const prompt = `Based on the following design brief, generate a complete furniture build plan...
  // Design Brief: ${JSON.stringify(brief)}
  // Please return the response as a JSON object conforming to the BuildPlan schema.`;

  // 2. Call the backend API endpoint that interfaces with GPT-4o
  // const backendApiUrl = '/api/ai/generate-plan'; // Example endpoint
  // try {
  //   const response = await fetch(backendApiUrl, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ designBrief: brief }), // Send the brief to the backend
  //   });
  //   if (!response.ok) {
  //     console.error('Error fetching from backend API:', response.status, await response.text());
  //     return null;
  //   }
  //   const aiGeneratedJson = await response.json();

  // For now, let's use a MOCK AI response to simulate the process:
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  const mockAiResponse = {
    id: 'plan_' + Date.now(),
    userId: 'user_mock_123',
    planName: `Mock Plan for: ${brief.description.substring(0, 20)}`,
    designBrief: {
      ...brief,
      targetDimensions: brief.targetDimensions || { units: "in" },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    components: [
      { id: 'comp_1', name: 'Table Top', quantity: 1, dimensions: 'L:48in W:30in T:1.5in', materialId: 'mat_wood_01' },
      { id: 'comp_2', name: 'Leg', quantity: 4, dimensions: 'L:28.5in W:2in T:2in', materialId: 'mat_wood_01' },
    ],
    materials: [
      { id: 'mat_wood_01', name: brief.material || 'Oak', type: 'Lumber', grade: 'FAS' },
    ],
    hardware: [
      { id: 'hw_01', name: 'Wood Screws', type: 'Hardware', size: '#8 x 1.25in', quantity: 50 },
    ],
    joinery: [
      { id: 'join_01', type: 'Mortise and Tenon', description: 'For attaching legs to aprons (if any)' },
    ],
    cutList: [
      { id: 'cl_1', componentName: 'Table Top', partName: 'Top Panel', quantity: 1, length: '48in', width: '30in', thickness: '1.5in', material: brief.material || 'Oak' },
      { id: 'cl_2', componentName: 'Leg', partName: 'Leg Blank', quantity: 4, length: '28.5in', width: '2in', thickness: '2in', material: brief.material || 'Oak' },
    ],
    billOfMaterials: [
      { id: 'bom_1', itemId: 'mat_wood_01', itemName: brief.material || 'Oak', itemType: 'Material', quantity: 10, unit: 'board foot', unitCost: 12, totalCost: 120 },
      { id: 'bom_2', itemId: 'hw_01', itemName: 'Wood Screws', itemType: 'Hardware', quantity: 50, unit: 'pieces', unitCost: 0.1, totalCost: 5 },
    ],
    assemblyInstructions: [
      { stepNumber: 1, title: 'Prepare Legs', description: 'Cut legs to final dimensions.', componentsInvolved: ['Leg'] },
      { stepNumber: 2, title: 'Prepare Top', description: 'Cut and flatten table top.', componentsInvolved: ['Table Top'] },
      { stepNumber: 3, title: 'Assemble Base', description: 'Join legs and aprons.', componentsInvolved: ['Leg'], hardwareUsed:['Wood Screws'] },
      { stepNumber: 4, title: 'Attach Top', description: 'Attach top to base.', componentsInvolved: ['Table Top', 'Leg'] },
    ],
    modelUrl: 'https://example.com/model.glb',
    status: 'Draft',
    version: 1,
    notes: 'This is a mock plan generated by the aiPlannerService.',
  };
  // const aiGeneratedJson = mockAiResponse; // Use this line when fetch is commented out

  // 3. Parse and validate the AI's JSON response using Zod
  const validationResult = BuildPlanSchema.safeParse(mockAiResponse); // Replace mockAiResponse with aiGeneratedJson when live

  if (validationResult.success) {
    console.log('AI Planner Service: Plan generated and validated successfully.');
    return validationResult.data as BuildPlan;
  } else {
    console.error('AI Planner Service: Zod validation failed:', validationResult.error.errors);
    // Potentially log validationResult.error.issues for more detailed errors
    // You might want to throw an error or return a more specific error object here
    return null;
  }
  // } catch (error) {
  //   console.error('AI Planner Service: Error during plan generation:', error);
  //   return null;
  // }
} 