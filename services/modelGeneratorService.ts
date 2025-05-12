import { BuildPlan, ComponentModel, MaterialModel } from "../src/types/design";

/**
 * Parses dimensions string into numeric values
 * @param dimensionStr String containing dimensions (e.g., "L:48in W:30in T:1.5in")
 * @returns Object with parsed length, width, and thickness values
 */
export const parseDimensions = (dimensionStr: string) => {
  const dimensions = { length: 1, width: 1, thickness: 0.1 }; // Default dimensions

  // Parse dimensions like "L:48in W:30in T:1.5in"
  const lengthMatch = dimensionStr.match(/L:([\d.]+)\s*in/i);
  const widthMatch = dimensionStr.match(/W:([\d.]+)\s*in/i);
  const thicknessMatch = dimensionStr.match(/T:([\d.]+)\s*in/i);

  // Also try to match dimensions without the L:, W:, T: prefixes
  const simpleLengthMatch =
    !lengthMatch &&
    dimensionStr.match(
      /([\d.]+)\s*in\s*[×x]\s*([\d.]+)\s*in\s*[×x]\s*([\d.]+)\s*in/i,
    );

  if (lengthMatch && lengthMatch[1] && !isNaN(parseFloat(lengthMatch[1])))
    dimensions.length = parseFloat(lengthMatch[1]) / 24; // Scale down for scene
  else if (
    simpleLengthMatch &&
    simpleLengthMatch[1] &&
    !isNaN(parseFloat(simpleLengthMatch[1]))
  )
    dimensions.length = parseFloat(simpleLengthMatch[1]) / 24; // Scale down for scene

  if (widthMatch && widthMatch[1] && !isNaN(parseFloat(widthMatch[1])))
    dimensions.width = parseFloat(widthMatch[1]) / 24; // Scale down for scene
  else if (
    simpleLengthMatch &&
    simpleLengthMatch[2] &&
    !isNaN(parseFloat(simpleLengthMatch[2]))
  )
    dimensions.width = parseFloat(simpleLengthMatch[2]) / 24; // Scale down for scene

  if (
    thicknessMatch &&
    thicknessMatch[1] &&
    !isNaN(parseFloat(thicknessMatch[1]))
  )
    dimensions.thickness = parseFloat(thicknessMatch[1]) / 24; // Scale down for scene
  else if (
    simpleLengthMatch &&
    simpleLengthMatch[3] &&
    !isNaN(parseFloat(simpleLengthMatch[3]))
  )
    dimensions.thickness = parseFloat(simpleLengthMatch[3]) / 24; // Scale down for scene

  return dimensions;
};

/**
 * Get material color based on material name
 * @param materialId Material ID to look up
 * @param materials Array of materials from the build plan
 * @param defaultColor Default color to use if material not found
 * @returns Hex color string
 */
export const getMaterialColor = (
  materialId: string | undefined,
  materials: MaterialModel[] | undefined,
  defaultColor: string = "#8B4513",
): string => {
  if (!materialId || !materials || !Array.isArray(materials))
    return defaultColor;

  const material = materials.find((m) => m.id === materialId);
  if (!material || !material.name) return defaultColor;

  // Map common wood types to colors
  const materialColors: Record<string, string> = {
    Oak: "#D4A76A",
    Walnut: "#6F4E37",
    Maple: "#E8D4AD",
    Cherry: "#A52A2A",
    Pine: "#EADC9F",
    Mahogany: "#C04000",
  };

  return materialColors[material.name] || defaultColor;
};

/**
 * Determine component dimensions based on component name and parsed dimensions
 * @param component Component model data
 * @param parsedDimensions Parsed dimensions object
 * @returns Array of dimensions [length, width, height]
 */
export const getComponentDimensions = (
  component: ComponentModel,
  parsedDimensions: { length: number; width: number; thickness: number },
): [number, number, number] => {
  const { length, width, thickness } = parsedDimensions;
  const name = component.name ? component.name.toLowerCase() : "";

  if (name.includes("leg")) {
    return [thickness, length, thickness];
  } else if (name.includes("back")) {
    return [length, width, thickness / 2];
  } else if (name.includes("drawer")) {
    return [length * 0.8, thickness * 3, width * 0.8];
  } else if (name.includes("shelf")) {
    return [length, thickness, width * 0.9];
  } else if (name.includes("apron") || name.includes("rail")) {
    return [length, thickness, width / 4];
  }

  // Default for table tops, surfaces, etc.
  return [length, thickness, width];
};

/**
 * Calculate component position based on its name and dimensions
 * @param component Component model data
 * @param parsedDimensions Parsed dimensions object
 * @param index Index of the component in the array (for positioning multiple similar components)
 * @returns Position coordinates [x, y, z]
 */
export const getComponentPosition = (
  component: ComponentModel,
  parsedDimensions: { length: number; width: number; thickness: number },
  index: number,
): [number, number, number] => {
  const { length, width, thickness } = parsedDimensions;
  const name = component.name ? component.name.toLowerCase() : "";

  // Base height for positioning components vertically
  const baseHeight = 0;

  if (name.includes("top") || name.includes("surface")) {
    return [0, baseHeight + 0.75, 0];
  } else if (name.includes("leg")) {
    // Position legs at corners
    const legPositions: Array<[number, number, number]> = [
      [-length / 2 + thickness / 2, baseHeight, -width / 2 + thickness / 2],
      [length / 2 - thickness / 2, baseHeight, -width / 2 + thickness / 2],
      [-length / 2 + thickness / 2, baseHeight, width / 2 - thickness / 2],
      [length / 2 - thickness / 2, baseHeight, width / 2 - thickness / 2],
    ];
    return legPositions[index % 4];
  } else if (name.includes("shelf")) {
    return [0, baseHeight + 0.3 + index * 0.3, 0];
  } else if (name.includes("back")) {
    return [0, baseHeight + 0.5, -width / 2];
  } else if (name.includes("drawer")) {
    return [0, baseHeight + 0.4 + index * 0.3, width / 4];
  } else if (name.includes("apron") || name.includes("rail")) {
    // Position aprons/rails between legs
    const railPositions: Array<[number, number, number]> = [
      [0, baseHeight + 0.6, -width / 2 + thickness / 2], // front
      [0, baseHeight + 0.6, width / 2 - thickness / 2], // back
      [-length / 2 + thickness / 2, baseHeight + 0.6, 0], // left
      [length / 2 - thickness / 2, baseHeight + 0.6, 0], // right
    ];
    return railPositions[index % 4];
  }

  // Default positioning for other components
  return [0, baseHeight + index * 0.2, 0];
};

/**
 * Generate a Three.js mesh for a component
 * @param component Component model data
 * @param materials Array of materials from the build plan
 * @param index Index of the component in the array
 * @param defaultColor Default color to use if material not found
 * @returns Object with mesh properties for Three.js
 */
export const generateComponentMesh = (
  component: ComponentModel,
  materials: MaterialModel[] | undefined,
  index: number,
  defaultColor: string = "#8B4513",
) => {
  const parsedDimensions = parseDimensions(component.dimensions || "");
  const color = getMaterialColor(component.materialId, materials, defaultColor);
  const dimensions = getComponentDimensions(component, parsedDimensions);
  const position = getComponentPosition(component, parsedDimensions, index);

  return {
    key: component.id || `component-${index}`,
    position: position,
    dimensions: dimensions,
    color: color,
    name: component.name || `Component ${index}`,
  };
};

/**
 * Generate all meshes for a build plan
 * @param buildPlan Complete build plan with components and materials
 * @param defaultColor Default color to use if material not found
 * @returns Array of mesh properties for Three.js
 */
export const generateModelFromBuildPlan = (
  buildPlan: BuildPlan,
  defaultColor: string = "#8B4513",
) => {
  if (
    !buildPlan ||
    !buildPlan.components ||
    buildPlan.components.length === 0
  ) {
    return [];
  }

  const meshes: Array<{
    key: string;
    position: [number, number, number];
    dimensions: [number, number, number];
    color: string;
    name: string;
  }> = [];

  buildPlan.components.forEach((component, index) => {
    // For components with quantity > 1, generate multiple meshes
    if (component.quantity && component.quantity > 1) {
      for (let i = 0; i < component.quantity; i++) {
        const mesh = generateComponentMesh(
          { ...component, id: `${component.id || "component"}-${i}` },
          buildPlan.materials,
          i,
          defaultColor,
        );
        meshes.push(mesh);
      }
    } else {
      const mesh = generateComponentMesh(
        component,
        buildPlan.materials,
        index,
        defaultColor,
      );
      meshes.push(mesh);
    }
  });

  return meshes;
};
