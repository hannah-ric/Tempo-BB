// Types for furniture components
export interface Dimensions {
  in: number;
  mm: number;
}

export interface DimensionPair {
  in: [number, number];
  mm: [number, number];
}

export interface CommonLengths {
  imperial: number[];
  metric: number[];
}

export interface SheetSize {
  ft: [number, number];
  mm: [number, number];
}

export interface DensityMeasurement {
  value: number;
  unit: string;
}

export interface DensityValues {
  imperial: DensityMeasurement | null;
  metric: DensityMeasurement | null;
}

export interface ModulusValues {
  imperial: DensityMeasurement | null;
  metric: DensityMeasurement | null;
}

// Furniture component interfaces
export interface FurnitureComponent {
  id?: string;
  component: string;
  subtype: string;
  dimensions: Record<string, Dimensions>;
  tolerances: string;
  recommended_material: string;
  typical_uses: string[];
  notes: string;
  created_at?: string;
  updated_at?: string;
}

// Material interfaces
export interface LumberMaterial {
  id?: string;
  nominal_size: string;
  actual_size: DimensionPair;
  common_lengths: CommonLengths;
  tolerances: string;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

export interface SheetMaterial {
  id?: string;
  type: string;
  nominal_sheet_size: SheetSize;
  thickness_options: Dimensions[];
  tolerances: string;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

export interface OtherMaterial {
  id?: string;
  name: string;
  type: string;
  density: DensityValues;
  modulus_elasticity: ModulusValues;
  notes: string;
  created_at?: string;
  updated_at?: string;
}
