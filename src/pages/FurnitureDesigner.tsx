import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatInterface from "@/components/ChatInterface";
import ModelViewer from "@/components/ModelViewer";
import BuildPlanTabs from "@/components/BuildPlanTabs";
import MaterialSelector from "@/components/MaterialSelector";
import DimensionControls from "@/components/DimensionControls";
import StyleSelector from "@/components/StyleSelector";
import SaveDesignDialog from "@/components/SaveDesignDialog";
import ShareDesignDialog from "@/components/ShareDesignDialog";
import { Button } from "@/components/ui/button";
import { Save, Share2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface FurnitureDesign {
  id: string;
  name: string;
  modelType: "table" | "chair" | "desk" | "bookshelf" | "box" | "custom";
  materials: string[];
  dimensions: Record<string, number>;
  style: string;
  joineryMethods: string[];
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
  const [currentDesign, setCurrentDesign] = useState<FurnitureDesign>({
    id: "1",
    name: "Dining Table",
    modelType: "table",
    materials: ["Maple"],
    dimensions: { length: 60, width: 30, height: 29 },
    style: "Modern",
    joineryMethods: ["Mortise and Tenon"],
  });

  const handleSendMessage = (message: string) => {
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI processing
    setIsProcessing(true);

    setTimeout(() => {
      // Process the message and update the design
      processUserMessage(message);

      // Add AI response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(message),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1500);
  };

  const processUserMessage = (message: string) => {
    const lowerMessage = message.toLowerCase();

    // Simple rule-based processing
    if (lowerMessage.includes("walnut")) {
      setCurrentDesign((prev) => ({
        ...prev,
        materials: ["Walnut"],
      }));
    }

    if (lowerMessage.includes("taller") || lowerMessage.includes("height")) {
      setCurrentDesign((prev) => ({
        ...prev,
        dimensions: { ...prev.dimensions, height: prev.dimensions.height + 2 },
      }));
    }

    if (lowerMessage.includes("wider") || lowerMessage.includes("width")) {
      setCurrentDesign((prev) => ({
        ...prev,
        dimensions: { ...prev.dimensions, width: prev.dimensions.width + 4 },
      }));
    }

    if (lowerMessage.includes("longer") || lowerMessage.includes("length")) {
      setCurrentDesign((prev) => ({
        ...prev,
        dimensions: { ...prev.dimensions, length: prev.dimensions.length + 6 },
      }));
    }

    if (lowerMessage.includes("dovetail")) {
      setCurrentDesign((prev) => ({
        ...prev,
        joineryMethods: [...prev.joineryMethods, "Dovetail"],
      }));
    }

    if (
      lowerMessage.includes("mid-century") ||
      lowerMessage.includes("midcentury")
    ) {
      setCurrentDesign((prev) => ({
        ...prev,
        style: "Mid-Century Modern",
      }));
    }

    if (lowerMessage.includes("chair")) {
      setCurrentDesign((prev) => ({
        ...prev,
        modelType: "chair",
        name: "Dining Chair",
        dimensions: { height: 32, width: 18, depth: 20 },
      }));
    }

    if (lowerMessage.includes("desk")) {
      setCurrentDesign((prev) => ({
        ...prev,
        modelType: "desk",
        name: "Writing Desk",
        dimensions: { length: 48, width: 24, height: 30 },
      }));
    }

    if (
      lowerMessage.includes("bookshelf") ||
      lowerMessage.includes("bookcase")
    ) {
      setCurrentDesign((prev) => ({
        ...prev,
        modelType: "bookshelf",
        name: "Bookshelf",
        dimensions: { height: 72, width: 36, depth: 12 },
      }));
    }
  };

  const generateAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("walnut")) {
      return "I've updated the material to walnut. This hardwood has a rich, dark color and excellent durability. It's a premium choice that will give your furniture a sophisticated look.";
    }

    if (lowerMessage.includes("taller") || lowerMessage.includes("height")) {
      return `I've increased the height of your ${currentDesign.name}. The new height is ${currentDesign.dimensions.height}" which should better suit your needs.`;
    }

    if (lowerMessage.includes("wider") || lowerMessage.includes("width")) {
      return `I've made your ${currentDesign.name} wider. The new width is ${currentDesign.dimensions.width}". This provides more surface area while maintaining proper proportions.`;
    }

    if (lowerMessage.includes("longer") || lowerMessage.includes("length")) {
      return `I've extended the length of your ${currentDesign.name}. The new length is ${currentDesign.dimensions.length}". This gives you more functional space while preserving the design aesthetic.`;
    }

    if (lowerMessage.includes("dovetail")) {
      return "I've added dovetail joinery to the design. Dovetail joints are not only strong but also add visual interest and craftsmanship to your furniture piece.";
    }

    if (
      lowerMessage.includes("mid-century") ||
      lowerMessage.includes("midcentury")
    ) {
      return "I've updated the style to Mid-Century Modern. This style features clean lines, gentle organic curves, and a mix of traditional and non-traditional materials. It's a timeless look that remains popular today.";
    }

    if (lowerMessage.includes("chair")) {
      return 'I\'ve created a dining chair design for you. The chair has a height of 32", width of 18", and depth of 20". You can see the 3D model in the design tab.';
    }

    if (lowerMessage.includes("desk")) {
      return 'I\'ve designed a writing desk for you. The desk has dimensions of 48" length, 24" width, and 30" height. It\'s a versatile piece that would work well in a home office or study.';
    }

    if (
      lowerMessage.includes("bookshelf") ||
      lowerMessage.includes("bookcase")
    ) {
      return 'I\'ve created a bookshelf design for you. The bookshelf stands 72" tall, 36" wide, and 12" deep. It provides ample storage space while maintaining a balanced appearance.';
    }

    return "I've updated your design based on your request. You can see the changes in the 3D model. Is there anything specific you'd like to modify further?";
  };

  // Generate components list based on current design
  const generateComponents = () => {
    if (currentDesign.modelType === "table") {
      return [
        {
          id: "1",
          name: "Table Top",
          material: currentDesign.materials[0] || "Maple",
          dimensions: {
            length: currentDesign.dimensions.length || 60,
            width: currentDesign.dimensions.width || 30,
            thickness: 1.5,
          },
          quantity: 1,
        },
        {
          id: "2",
          name: "Leg",
          material: currentDesign.materials[0] || "Maple",
          dimensions: {
            length: currentDesign.dimensions.height
              ? currentDesign.dimensions.height - 1.5
              : 28,
            width: 2,
            thickness: 2,
          },
          quantity: 4,
        },
        {
          id: "3",
          name: "Apron",
          material: currentDesign.materials[0] || "Maple",
          dimensions: {
            length: currentDesign.dimensions.length
              ? currentDesign.dimensions.length - 4
              : 56,
            width: 4,
            thickness: 0.75,
          },
          quantity: 2,
        },
        {
          id: "4",
          name: "Apron",
          material: currentDesign.materials[0] || "Maple",
          dimensions: {
            length: currentDesign.dimensions.width
              ? currentDesign.dimensions.width - 4
              : 26,
            width: 4,
            thickness: 0.75,
          },
          quantity: 2,
        },
      ];
    } else if (currentDesign.modelType === "chair") {
      return [
        {
          id: "1",
          name: "Seat",
          material: currentDesign.materials[0] || "Maple",
          dimensions: {
            length: currentDesign.dimensions.width || 18,
            width: currentDesign.dimensions.depth || 18,
            thickness: 1,
          },
          quantity: 1,
        },
        {
          id: "2",
          name: "Back",
          material: currentDesign.materials[0] || "Maple",
          dimensions: {
            length: currentDesign.dimensions.width || 18,
            width: currentDesign.dimensions.height
              ? currentDesign.dimensions.height - 18
              : 14,
            thickness: 0.75,
          },
          quantity: 1,
        },
        {
          id: "3",
          name: "Leg",
          material: currentDesign.materials[0] || "Maple",
          dimensions: {
            length: 18,
            width: 1.5,
            thickness: 1.5,
          },
          quantity: 4,
        },
      ];
    } else {
      // Default components for other furniture types
      return [
        {
          id: "1",
          name: "Main Panel",
          material: currentDesign.materials[0] || "Maple",
          dimensions: {
            length: currentDesign.dimensions.length || 30,
            width: currentDesign.dimensions.width || 20,
            thickness: 0.75,
          },
          quantity: 1,
        },
        {
          id: "2",
          name: "Support",
          material: currentDesign.materials[0] || "Maple",
          dimensions: {
            length: 20,
            width: 2,
            thickness: 2,
          },
          quantity: 4,
        },
      ];
    }
  };

  return (
    <div className="container mx-auto p-4 h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Furniture Design Generator</h1>
        <div className="flex gap-2">
          <SaveDesignDialog
            onSave={(name, description) => {
              console.log("Saving design:", name, description);
              // Here you would typically save to a database
              // For now we just update the current design name
              setCurrentDesign((prev) => ({
                ...prev,
                name: name,
              }));
            }}
            defaultName={currentDesign.name}
            defaultDescription=""
          />
          <ShareDesignDialog
            designName={currentDesign.name}
            designId={currentDesign.id}
            onExport={() => {
              console.log("Exporting design:", currentDesign);
              // Here you would generate a PDF or other export format
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
                  modelType={currentDesign.modelType}
                  backgroundColor="#f5f5f5"
                  showControls={true}
                  showGrid={false}
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
                      <p>{currentDesign.name}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Material</h3>
                      <p>{currentDesign.materials.join(", ")}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Dimensions</h3>
                      <ul>
                        {Object.entries(currentDesign.dimensions).map(
                          ([key, value]) => (
                            <li key={key}>
                              {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                              {value}"
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium">Style</h3>
                      <p>{currentDesign.style}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Joinery Methods</h3>
                      <p>{currentDesign.joineryMethods.join(", ")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="dimensions" className="w-full">
                <TabsList className="grid grid-cols-3 mb-2">
                  <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                </TabsList>

                <TabsContent value="dimensions">
                  <DimensionControls
                    dimensions={currentDesign.dimensions}
                    onDimensionChange={(key, value) => {
                      setCurrentDesign((prev) => ({
                        ...prev,
                        dimensions: {
                          ...prev.dimensions,
                          [key]: value,
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
                    selectedMaterial={currentDesign.materials[0]}
                    onSelectMaterial={(materialName) => {
                      setCurrentDesign((prev) => ({
                        ...prev,
                        materials: [materialName],
                      }));
                    }}
                  />
                </TabsContent>

                <TabsContent value="style">
                  <StyleSelector
                    selectedStyle={currentDesign.style
                      .toLowerCase()
                      .replace(" ", "-")}
                    onStyleChange={(styleId) => {
                      // Convert style ID to display name
                      let styleName = styleId
                        .split("-")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ");

                      setCurrentDesign((prev) => ({
                        ...prev,
                        style: styleName,
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
            components={generateComponents()}
            cutList={generateComponents()}
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
