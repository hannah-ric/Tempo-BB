import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatInterface from "@/components/ChatInterface";
import ModelViewer from "@/components/ModelViewer";
import BuildPlanTabs from "@/components/BuildPlanTabs";
import MaterialSelector from "@/components/MaterialSelector";
import DimensionControls from "@/components/DimensionControls";
import StyleSelector from "@/components/StyleSelector";
import JoinerySelector from "@/components/JoinerySelector";
import SaveDesignDialog from "@/components/SaveDesignDialog";
import ShareDesignDialog from "@/components/ShareDesignDialog";
import { Button } from "@/components/ui/button";
import { Save, Share2 } from "lucide-react";
import {
  FurnitureDesignBrief,
  BuildPlan,
  ComponentModel,
  MaterialModel,
  CutListItem,
  JoineryModel,
} from "../types/design";
import { generatePlanFromBrief } from "../../services/aiPlannerService";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const FurnitureDesigner = () => {
  const [activeTab, setActiveTab] = useState("design");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Welcome to the AI Furniture Design Generator! Describe the furniture piece you want to create.",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [designBrief, setDesignBrief] = useState<FurnitureDesignBrief>({
    description: "A standard piece of furniture.",
    targetDimensions: { units: "in" },
  });
  const [selectedJoineryMethods, setSelectedJoineryMethods] = useState<
    string[]
  >([]);
  const [currentBuildPlan, setCurrentBuildPlan] = useState<BuildPlan | null>(
    null,
  );

  useEffect(() => {
    if (
      designBrief.description !== "A standard piece of furniture." &&
      !isProcessing
    ) {
      const fetchPlan = async () => {
        console.log(
          "FurnitureDesigner: Design Brief updated, attempting to generate BuildPlan:",
          designBrief,
        );
        setIsProcessing(true);
        try {
          const plan = await generatePlanFromBrief(designBrief);
          if (plan) {
            console.log(
              "FurnitureDesigner: Successfully received and validated plan:",
              plan,
            );
            setCurrentBuildPlan(plan);
          } else {
            console.error(
              "FurnitureDesigner: Failed to generate or validate build plan.",
            );
            alert(
              "Error: Could not generate the build plan. Please try again or modify your brief.",
            );
          }
        } catch (error) {
          console.error(
            "FurnitureDesigner: Error calling generatePlanFromBrief:",
            error,
          );
          alert("An unexpected error occurred while generating the plan.");
        }
        setIsProcessing(false);
      };

      fetchPlan();
    }
  }, [designBrief, isProcessing]);

  const handleSendMessage = (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    processUserMessage(message);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(message, designBrief),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1500);
  };

  const processUserMessage = (message: string) => {
    const lowerMessage = message.toLowerCase();
    let briefUpdates: Partial<FurnitureDesignBrief> = {};
    let dimensionsChanged = false;
    let joineryChanged = false;

    // Material parsing
    if (
      lowerMessage.includes("walnut") ||
      lowerMessage.includes("oak") ||
      lowerMessage.includes("maple") ||
      lowerMessage.includes("cherry")
    ) {
      const materials = ["walnut", "oak", "maple", "cherry"];
      const foundMaterial = materials.find((m) => lowerMessage.includes(m));
      if (foundMaterial) {
        briefUpdates.material =
          foundMaterial.charAt(0).toUpperCase() + foundMaterial.slice(1);
      }
    }

    // Style parsing
    if (lowerMessage.includes("style")) {
      const styleKeywords = [
        "modern",
        "traditional",
        "mid-century",
        "rustic",
        "industrial",
      ];
      const foundStyle = styleKeywords.find((s) => lowerMessage.includes(s));
      if (foundStyle) {
        briefUpdates.style = foundStyle
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      }
    }

    // Joinery parsing
    const joineryKeywords = [
      "mortise and tenon",
      "dovetail",
      "pocket hole",
      "butt joint",
      "miter joint",
    ];

    const foundJoinery = joineryKeywords.filter((j) =>
      lowerMessage.includes(j),
    );
    if (foundJoinery.length > 0) {
      joineryChanged = true;

      // Convert to proper format and update selected methods
      const joineryIds = foundJoinery.map((j) =>
        j.toLowerCase().replace(/ and /g, "-and-").replace(/ /g, "-"),
      );
      setSelectedJoineryMethods((prevMethods) => {
        // Add new methods without duplicates
        const newMethods = [...new Set([...prevMethods, ...joineryIds])];
        return newMethods;
      });

      // Update the brief with proper names
      const joineryNames = foundJoinery.map((j) =>
        j
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      );

      briefUpdates.joineryMethods = joineryNames;
    }

    // Dimension parsing (heuristic)
    const dimRegex =
      /(\d+\.?\d*)\s*(inches|inch|in|cm|centimeters|mm|millimeters|feet|foot|ft)/g;
    let match;
    const newTargetDimensions = {
      ...(designBrief.targetDimensions || { units: "in" }),
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
      if (!briefUpdates.description && designBrief.description !== message) {
        briefUpdates.description = `${designBrief.description} (Processed: ${message})`;
      }
    }

    setDesignBrief((prev) => ({
      ...prev,
      ...briefUpdates,
      description: briefUpdates.description || prev.description, // Keep old description if not updated
      targetDimensions: briefUpdates.targetDimensions || prev.targetDimensions, // Persist targetDimensions
    }));
  };

  const generateAIResponse = (
    message: string,
    currentBrief: FurnitureDesignBrief,
  ): string => {
    const lowerMessage = message.toLowerCase();

    if (
      currentBrief.material &&
      (lowerMessage.includes(currentBrief.material.toLowerCase()) ||
        lowerMessage.includes("material"))
    ) {
      return `OK! I've noted the material as ${currentBrief.material}. The AI will consider this for the build plan.`;
    }

    if (
      currentBrief.style &&
      (lowerMessage.includes(currentBrief.style.toLowerCase()) ||
        lowerMessage.includes("style"))
    ) {
      return `Understood. The style is set to ${currentBrief.style}. This will be used in the plan generation.`;
    }

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
      return `Great! I've updated the joinery methods to include ${joineryList}. These will be incorporated into your build plan.`;
    }

    if (
      lowerMessage.includes("tall") ||
      lowerMessage.includes("height") ||
      lowerMessage.includes("wide") ||
      lowerMessage.includes("width") ||
      lowerMessage.includes("long") ||
      lowerMessage.includes("length") ||
      lowerMessage.includes("deep") ||
      lowerMessage.includes("depth")
    ) {
      return `I've updated the design brief with your dimension requests: "${message}". The AI will generate a detailed plan based on this.`;
    }

    if (isProcessing) {
      return `I've updated the design brief: "${message}". The detailed build plan is currently being generated...`;
    }

    return `I've updated the design brief with: "${message}". The AI will generate a plan. What else?`;
  };

  const generateComponents = (): ComponentModel[] => {
    if (currentBuildPlan && currentBuildPlan.components.length > 0) {
      return currentBuildPlan.components;
    }
    if (
      currentBuildPlan?.designBrief.description.toLowerCase().includes("table")
    ) {
      return [
        {
          id: "1",
          name: "Table Top",
          materialId: currentBuildPlan.materials[0]?.id || "defaultMatId",
          dimensions: "L:60in W:30in T:1.5in",
          quantity: 1,
        },
        {
          id: "2",
          name: "Leg",
          materialId: currentBuildPlan.materials[0]?.id || "defaultMatId",
          dimensions: "L:28in W:2in T:2in",
          quantity: 4,
        },
      ];
    }
    return [];
  };

  const generateCutList = (): CutListItem[] => {
    if (currentBuildPlan && currentBuildPlan.cutList.length > 0) {
      return currentBuildPlan.cutList;
    }
    if (
      currentBuildPlan?.designBrief.description.toLowerCase().includes("table")
    ) {
      return [
        {
          id: "cl1",
          componentName: "Table Top",
          partName: "Top Panel",
          quantity: 1,
          length: "60in",
          width: "30in",
          thickness: "1.5in",
          material: currentBuildPlan.materials[0]?.name || "Wood",
        },
        {
          id: "cl2",
          componentName: "Leg",
          partName: "Leg Member",
          quantity: 4,
          length: "28in",
          width: "2in",
          thickness: "2in",
          material: currentBuildPlan.materials[0]?.name || "Wood",
        },
      ];
    }
    return [];
  };

  return (
    <div className="container mx-auto p-4 h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Furniture Design Generator</h1>
        <div className="flex gap-2">
          <SaveDesignDialog
            onSave={(name, description) => {
              console.log("Saving design:", name, description);
              if (currentBuildPlan) {
                setCurrentBuildPlan((prev) =>
                  prev
                    ? {
                        ...prev,
                        planName: name,
                      }
                    : null,
                );
              } else {
                setDesignBrief((prev) => ({ ...prev, description: name }));
              }
            }}
            defaultName={
              currentBuildPlan?.planName ||
              designBrief.description.substring(0, 30)
            }
            defaultDescription={
              currentBuildPlan?.designBrief.description ||
              designBrief.description
            }
          />
          <ShareDesignDialog
            designName={currentBuildPlan?.planName || "Untitled Design"}
            designId={currentBuildPlan?.id || "N/A"}
            onExport={() => {
              console.log("Exporting design:", currentBuildPlan);
              alert("Build plan exported! (This is a placeholder)");
            }}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="build">Build Plan</TabsTrigger>
          <TabsTrigger value="chat">AI Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="design" className="mt-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="col-span-2">
              <CardContent className="p-4 h-[600px]">
                <ModelViewer
                  modelType={
                    currentBuildPlan?.designBrief.description
                      .toLowerCase()
                      .includes("chair")
                      ? "chair"
                      : "table"
                  }
                  backgroundColor="#f5f5f5"
                  showControls={true}
                  showGrid={false}
                  buildPlan={currentBuildPlan}
                  materialColor={
                    currentBuildPlan?.designBrief.material
                      ?.toLowerCase()
                      .includes("walnut")
                      ? "#6F4E37"
                      : currentBuildPlan?.designBrief.material
                            ?.toLowerCase()
                            .includes("oak")
                        ? "#D4A76A"
                        : currentBuildPlan?.designBrief.material
                              ?.toLowerCase()
                              .includes("maple")
                          ? "#E8D4AD"
                          : "#8B4513"
                  }
                />
              </CardContent>
            </Card>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h2 className="text-xl font-bold mb-4">
                    Design Specifications
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Name</h3>
                      <p>
                        {currentBuildPlan?.planName ||
                          designBrief.description.substring(0, 50)}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Material</h3>
                      <p>
                        {currentBuildPlan?.designBrief.material ||
                          designBrief.material ||
                          "Not specified"}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Dimensions</h3>
                      {currentBuildPlan?.designBrief.targetDimensions ||
                      designBrief.targetDimensions ? (
                        <ul>
                          {Object.entries(
                            currentBuildPlan?.designBrief.targetDimensions ||
                              designBrief.targetDimensions ||
                              {},
                          ).map(([key, value]) => {
                            if (value && key !== "units")
                              return (
                                <li
                                  key={key}
                                >{`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}${(currentBuildPlan?.designBrief.targetDimensions || designBrief.targetDimensions)?.units || "in"}`}</li>
                              );
                            if (value && key === "units")
                              return <li key={key}>{`Units: ${value}`}</li>;
                            return null;
                          })}
                        </ul>
                      ) : (
                        <p>Not specified</p>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">Style</h3>
                      <p>
                        {currentBuildPlan?.designBrief.style ||
                          designBrief.style ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="dimensions" className="w-full">
                <TabsList className="grid grid-cols-4 mb-2">
                  <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                  <TabsTrigger value="joinery">Joinery</TabsTrigger>
                </TabsList>

                <TabsContent value="dimensions">
                  <DimensionControls
                    dimensions={designBrief.targetDimensions || { units: "in" }}
                    onDimensionChange={(key, value, unit) => {
                      setDesignBrief((prev) => ({
                        ...prev,
                        targetDimensions: {
                          ...(prev.targetDimensions || { units: "in" }),
                          [key]: value,
                          units: unit || prev.targetDimensions?.units || "in",
                        },
                      }));
                    }}
                    minValues={{
                      length: 24,
                      width: 12,
                      height: 12,
                      depth: 12,
                    }}
                    maxValues={{
                      length: 96,
                      width: 48,
                      height: 42,
                      depth: 36,
                    }}
                  />
                </TabsContent>

                <TabsContent value="materials">
                  <MaterialSelector
                    selectedMaterial={designBrief.material || ""}
                    onSelectMaterial={(materialName) => {
                      setDesignBrief((prev) => ({
                        ...prev,
                        material: materialName,
                      }));
                    }}
                  />
                </TabsContent>

                <TabsContent value="style">
                  <StyleSelector
                    selectedStyle={(designBrief.style || "Modern")
                      .toLowerCase()
                      .replace(" ", "-")}
                    onStyleChange={(styleId) => {
                      let styleName = styleId
                        .split("-")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ");

                      setDesignBrief((prev) => ({
                        ...prev,
                        style: styleName,
                      }));
                    }}
                  />
                </TabsContent>

                <TabsContent value="joinery">
                  <JoinerySelector
                    selectedMethods={selectedJoineryMethods}
                    onJoineryChange={(methods) => {
                      setSelectedJoineryMethods(methods);
                      // Update the design brief with the selected joinery methods
                      const joineryNames = methods.map((methodId) => {
                        // Convert kebab-case back to Title Case
                        return methodId
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1),
                          )
                          .join(" ")
                          .replace("And", "and"); // Fix "Mortise And Tenon" to "Mortise and Tenon"
                      });

                      setDesignBrief((prev) => ({
                        ...prev,
                        joineryMethods: joineryNames,
                      }));
                    }}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="build" className="mt-2">
          <BuildPlanTabs
            components={currentBuildPlan?.components || generateComponents()}
            cutList={currentBuildPlan?.cutList || generateCutList()}
            materials={currentBuildPlan?.materials || []}
            hardware={currentBuildPlan?.hardware || []}
            assemblySteps={currentBuildPlan?.assemblySteps || []}
          />
        </TabsContent>

        <TabsContent value="chat" className="mt-2">
          <div className="h-[600px]">
            <ChatInterface
              messages={messages}
              isProcessing={isProcessing}
              onSendMessage={handleSendMessage}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FurnitureDesigner;
