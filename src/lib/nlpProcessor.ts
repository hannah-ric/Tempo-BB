import { FurnitureDesignBrief } from "../types/design";

/**
 * Process natural language input to extract furniture design parameters
 * @param message User's natural language input
 * @param currentBrief Current design brief to update
 * @returns Updated design brief with extracted parameters
 */
export function processNaturalLanguageInput(
  message: string,
  currentBrief: FurnitureDesignBrief,
): FurnitureDesignBrief {
  const lowerMessage = message.toLowerCase();
  let briefUpdates: Partial<FurnitureDesignBrief> = {};
  let dimensionsChanged = false;
  let joineryChanged = false;

  // Extract furniture type
  const furnitureTypes = [
    "table",
    "chair",
    "desk",
    "bookshelf",
    "cabinet",
    "dresser",
    "bed",
    "bench",
    "stool",
    "shelf",
    "nightstand",
    "coffee table",
    "dining table",
    "sideboard",
    "wardrobe",
  ];

  for (const type of furnitureTypes) {
    if (lowerMessage.includes(type)) {
      if (!briefUpdates.furnitureType) {
        briefUpdates.furnitureType =
          type.charAt(0).toUpperCase() + type.slice(1);
      }
    }
  }

  // Material parsing
  const materials = [
    "walnut",
    "oak",
    "maple",
    "cherry",
    "pine",
    "mahogany",
    "birch",
    "ash",
    "cedar",
    "teak",
    "plywood",
    "mdf",
  ];

  for (const material of materials) {
    if (lowerMessage.includes(material)) {
      briefUpdates.material =
        material.charAt(0).toUpperCase() + material.slice(1);
      break;
    }
  }

  // Style parsing
  const styleKeywords = [
    "modern",
    "traditional",
    "mid-century",
    "rustic",
    "industrial",
    "scandinavian",
    "farmhouse",
    "contemporary",
    "minimalist",
    "art deco",
    "bohemian",
    "coastal",
  ];

  for (const style of styleKeywords) {
    if (lowerMessage.includes(style)) {
      briefUpdates.style = style
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      break;
    }
  }

  // Joinery parsing
  const joineryKeywords = [
    "mortise and tenon",
    "dovetail",
    "pocket hole",
    "butt joint",
    "miter joint",
    "finger joint",
    "lap joint",
    "biscuit joint",
    "dowel joint",
    "tongue and groove",
  ];

  const foundJoinery = joineryKeywords.filter((j) => lowerMessage.includes(j));
  if (foundJoinery.length > 0) {
    joineryChanged = true;

    // Convert to proper format for joinery methods
    const joineryNames = foundJoinery.map((j) =>
      j
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
        .replace("And", "and"),
    );

    briefUpdates.joineryMethods = joineryNames;
  }

  // Dimension parsing
  const dimRegex =
    /(\d+\.?\d*)\s*(inches|inch|in|cm|centimeters|mm|millimeters|feet|foot|ft)/g;
  let match;
  const newTargetDimensions = {
    ...(currentBrief.targetDimensions || { units: "in" }),
  };

  while ((match = dimRegex.exec(lowerMessage)) !== null) {
    const value = match[1];
    const unit = match[2].toLowerCase();
    let currentUnit = newTargetDimensions.units || "in";

    if (unit.startsWith("in")) currentUnit = "in";
    else if (unit.startsWith("cm")) currentUnit = "cm";
    else if (unit.startsWith("mm")) currentUnit = "mm";
    // Basic conversion for feet to inches for simplicity
    else if (unit.startsWith("ft") || unit.startsWith("foot")) {
      const feetValue = parseFloat(value);
      if (!isNaN(feetValue)) {
        // assign to a dimension keyword if found near the value
        const dimKeywordMatch = lowerMessage
          .substring(0, match.index)
          .match(/(length|width|height|depth)\s*$/);
        const keyword = dimKeywordMatch ? dimKeywordMatch[1] : null;
        if (keyword)
          (newTargetDimensions as any)[keyword] = (feetValue * 12).toString();
        dimensionsChanged = true;
        newTargetDimensions.units = "in"; // Standardize to inches if feet are mentioned
        continue; // Skip assigning to generic dimension if feet directly assigned
      }
    }

    newTargetDimensions.units = currentUnit;

    // Try to associate with a dimension keyword if it precedes the number
    const precedingText = lowerMessage.substring(0, match.index);
    if (precedingText.match(/(length|long)/i))
      newTargetDimensions.length = value;
    else if (precedingText.match(/(width|wide)/i))
      newTargetDimensions.width = value;
    else if (precedingText.match(/(height|tall)/i))
      newTargetDimensions.height = value;
    else if (precedingText.match(/depth/i)) newTargetDimensions.depth = value;
    // Basic fallback: if no keyword, try to assign to first available L/W/H based on common order
    else if (!newTargetDimensions.length) newTargetDimensions.length = value;
    else if (!newTargetDimensions.width) newTargetDimensions.width = value;
    else if (!newTargetDimensions.height) newTargetDimensions.height = value;
    dimensionsChanged = true;
  }

  if (dimensionsChanged) {
    briefUpdates.targetDimensions = newTargetDimensions;
  }

  // Update description logic
  if (
    Object.keys(briefUpdates).length === 0 &&
    message.length > 10 &&
    !dimensionsChanged &&
    !joineryChanged
  ) {
    briefUpdates.description = message;
  } else if (
    Object.keys(briefUpdates).length > 0 ||
    dimensionsChanged ||
    joineryChanged
  ) {
    // If specific fields were updated, or dimensions changed, ensure description reflects the original message for context
    if (!briefUpdates.description && currentBrief.description !== message) {
      briefUpdates.description = message;
    }
  }

  return {
    ...currentBrief,
    ...briefUpdates,
    description: briefUpdates.description || currentBrief.description, // Keep old description if not updated
    targetDimensions:
      briefUpdates.targetDimensions || currentBrief.targetDimensions, // Persist targetDimensions
  };
}

/**
 * Generate an AI response based on the user's message and current design brief
 * @param message User's message
 * @param currentBrief Current design brief
 * @returns AI response message
 */
export function generateAIResponse(
  message: string,
  currentBrief: FurnitureDesignBrief,
): string {
  const lowerMessage = message.toLowerCase();

  // Check if the message is about starting a new design
  if (
    lowerMessage.includes("new design") ||
    lowerMessage.includes("start over") ||
    lowerMessage.includes("start new")
  ) {
    return "I've started a new design for you. What type of furniture would you like to create?";
  }

  // Check if the message is about material
  if (
    currentBrief.material &&
    (lowerMessage.includes(currentBrief.material.toLowerCase()) ||
      lowerMessage.includes("material"))
  ) {
    return `I've updated the material to ${currentBrief.material}. This will affect the appearance, durability, and cost of your furniture.`;
  }

  // Check if the message is about style
  if (
    currentBrief.style &&
    (lowerMessage.includes(currentBrief.style.toLowerCase()) ||
      lowerMessage.includes("style"))
  ) {
    return `I've set the style to ${currentBrief.style}. This will influence the overall design aesthetic and details.`;
  }

  // Check if the message is about joinery
  if (
    currentBrief.joineryMethods &&
    (lowerMessage.includes("joinery") ||
      lowerMessage.includes("joint") ||
      lowerMessage.includes("dovetail") ||
      lowerMessage.includes("mortise") ||
      lowerMessage.includes("tenon"))
  ) {
    const joineryList = Array.isArray(currentBrief.joineryMethods)
      ? currentBrief.joineryMethods.join(", ")
      : currentBrief.joineryMethods;
    return `I've updated the joinery methods to include ${joineryList}. These techniques will affect the strength, appearance, and complexity of your build.`;
  }

  // Check if the message is about dimensions
  if (
    lowerMessage.includes("tall") ||
    lowerMessage.includes("height") ||
    lowerMessage.includes("wide") ||
    lowerMessage.includes("width") ||
    lowerMessage.includes("long") ||
    lowerMessage.includes("length") ||
    lowerMessage.includes("deep") ||
    lowerMessage.includes("depth") ||
    lowerMessage.includes("inches") ||
    lowerMessage.includes("feet") ||
    lowerMessage.includes("cm")
  ) {
    const dimensions = currentBrief.targetDimensions;
    if (dimensions) {
      let dimensionText = "";
      if (dimensions.length)
        dimensionText += `length: ${dimensions.length}${dimensions.units}, `;
      if (dimensions.width)
        dimensionText += `width: ${dimensions.width}${dimensions.units}, `;
      if (dimensions.height)
        dimensionText += `height: ${dimensions.height}${dimensions.units}, `;
      if (dimensions.depth)
        dimensionText += `depth: ${dimensions.depth}${dimensions.units}, `;

      return `I've updated the dimensions to ${dimensionText.slice(0, -2)}. These measurements will be used to generate your build plan.`;
    }
    return `I've noted your dimension requirements and will incorporate them into the design.`;
  }

  // Generic responses
  if (currentBrief.description && currentBrief.description.length > 0) {
    return `I've updated your design brief with: "${message}". I'll generate a detailed build plan based on all your specifications.`;
  }

  return `I've noted your request: "${message}". What other details would you like to specify for your furniture design?`;
}
