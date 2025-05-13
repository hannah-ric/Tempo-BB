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
import BuildPlanList from "@/components/BuildPlanList";
import {
  getBuildPlan,
  saveBuildPlan,
  getUserBuildPlans,
  deleteBuildPlan,
} from "@/lib/database";
import { Button } from "@/components/ui/button";
import { Save, Share2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import AuthDialog from "@/components/AuthDialog";
import UserMenu from "@/components/UserMenu";
import {
  FurnitureDesignBrief,
  BuildPlan,
  ComponentModel,
  MaterialModel,
  CutListItem,
  JoineryModel,
} from "../types/design";
import { generatePlanFromBrief } from "../../services/aiPlannerService";
import {
  processNaturalLanguageInput,
  generateAIResponse,
} from "../lib/nlpProcessor";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const FurnitureDesigner = () => {
  const [activeTab, setActiveTab] = useState("design");
  const [showSavedPlans, setShowSavedPlans] = useState(false);
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
  const [viewMode, setViewMode] = useState<
    "assembled" | "exploded" | "animated"
  >("assembled");
  const [autoRotate, setAutoRotate] = useState(false);
  const { user, loading: authLoading } = useAuth();

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

      // If this is a new design request, reset the design brief
      const lowerMessage = message.toLowerCase();
      if (
        lowerMessage.includes("new design") ||
        lowerMessage.includes("start over")
      ) {
        setDesignBrief({
          description: "A new furniture design",
          targetDimensions: { units: "in" },
        });
        setCurrentBuildPlan(null);
        setSelectedJoineryMethods([]);
      }
    }, 1500);
  };

  // Process the user message using the NLP processor functions

  const processUserMessage = (message: string) => {
    // Process the message using the NLP processor
    const updatedBrief = processNaturalLanguageInput(message, designBrief);

    // Update joinery methods in the UI if they were changed
    if (updatedBrief.joineryMethods) {
      const joineryIds = Array.isArray(updatedBrief.joineryMethods)
        ? updatedBrief.joineryMethods.map((j) =>
            j.toLowerCase().replace(/ and /g, "-and-").replace(/ /g, "-"),
          )
        : [
            updatedBrief.joineryMethods
              .toLowerCase()
              .replace(/ and /g, "-and-")
              .replace(/ /g, "-"),
          ];

      setSelectedJoineryMethods((prevMethods) => {
        // Add new methods without duplicates
        const newMethods = [...new Set([...prevMethods, ...joineryIds])];
        return newMethods;
      });
    }

    // Update the design brief state
    setDesignBrief(updatedBrief);
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
        <div className="flex gap-2 items-center">
          {!authLoading && !user && <AuthDialog />}
          {!authLoading && user && <UserMenu />}
          <SaveDesignDialog
            onSave={(name, description) => {
              console.log("Saving design:", name, description);
              if (currentBuildPlan) {
                setCurrentBuildPlan((prev) =>
                  prev
                    ? {
                        ...prev,
                        planName: name,
                        designBrief: {
                          ...prev.designBrief,
                          description: description,
                        },
                      }
                    : null,
                );
              } else {
                setDesignBrief((prev) => ({
                  ...prev,
                  description: description,
                  name: name,
                }));
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
            buildPlan={currentBuildPlan}
            isUpdate={!!currentBuildPlan?.id}
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
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="build">Build Plan</TabsTrigger>
          <TabsTrigger value="saved">Saved Plans</TabsTrigger>
          <TabsTrigger value="chat">AI Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="design" className="mt-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="col-span-2">
              <CardContent className="p-4 h-[600px]">
                <div className="flex justify-end mb-2 space-x-2">
                  <Button
                    variant={viewMode === "assembled" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("assembled")}
                  >
                    Assembled
                  </Button>
                  <Button
                    variant={viewMode === "exploded" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("exploded")}
                  >
                    Exploded
                  </Button>
                  <Button
                    variant={viewMode === "animated" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("animated")}
                  >
                    Animated
                  </Button>
                  <Button
                    variant={autoRotate ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAutoRotate(!autoRotate)}
                  >
                    Auto-Rotate
                  </Button>
                </div>
                <ModelViewer
                  modelType={
                    currentBuildPlan?.designBrief.description
                      ?.toLowerCase()
                      .includes("chair")
                      ? "chair"
                      : "table"
                  }
                  backgroundColor="#f5f5f5"
                  showControls={true}
                  showGrid={false}
                  buildPlan={currentBuildPlan}
                  viewMode={viewMode}
                  rotationSpeed={autoRotate ? 0.5 : 0}
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
            assemblySteps={currentBuildPlan?.assemblyInstructions || []}
          />
        </TabsContent>

        <TabsContent value="saved" className="mt-2">
          <div className="h-[600px] overflow-y-auto">
            <BuildPlanList
              onSelectPlan={async (planId) => {
                try {
                  const plan = await getBuildPlan(planId);
                  if (plan && plan.plan_data) {
                    setCurrentBuildPlan(plan.plan_data);
                    setActiveTab("design");
                  }
                } catch (error) {
                  console.error("Error loading plan:", error);
                }
              }}
              onEditPlan={(planId) => {
                if (planId === "new") {
                  // Reset to create a new plan
                  setCurrentBuildPlan(null);
                  setDesignBrief({
                    description: "A new furniture design",
                    targetDimensions: { units: "in" },
                  });
                  setActiveTab("design");
                } else {
                  // Load the plan for editing
                  getBuildPlan(planId).then((plan) => {
                    if (plan && plan.plan_data) {
                      setCurrentBuildPlan(plan.plan_data);
                      setActiveTab("design");
                    }
                  });
                }
              }}
              onDeletePlan={async (planId) => {
                try {
                  // Delete the plan with the current user ID
                  const success = await deleteBuildPlan(planId, user?.id);

                  // If the current plan is deleted, reset the state
                  if (success && currentBuildPlan?.id === planId) {
                    setCurrentBuildPlan(null);
                  }
                } catch (error) {
                  console.error(`Error deleting plan ${planId}:`, error);
                }
              }}
              userId={user?.id}
            />
          </div>
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
