import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer, Share2 } from "lucide-react";
import ExportDialog from "./ExportDialog";

import {
  ComponentModel,
  MaterialModel,
  HardwareModel,
  CutListItem,
  AssemblyStep,
} from "../types/design";

interface Component extends ComponentModel {
  material?: string;
}

interface Material extends MaterialModel {
  quantity?: number;
}

interface Hardware extends HardwareModel {
  quantity?: number;
}

// Using types from design.ts

interface BuildPlanTabsProps {
  components?: Component[];
  cutList?: CutListItem[];
  materials?: Material[];
  hardware?: Hardware[];
  assemblySteps?: AssemblyStep[];
}

const BuildPlanTabs = ({
  components = [],
  cutList = [],
  materials = [],
  hardware = [],
  assemblySteps = [],
}: BuildPlanTabsProps) => {
  const [activeTab, setActiveTab] = useState("components");
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="w-full bg-background border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Build Plan</h2>
        <div className="flex gap-2">
          <ExportDialog
            buildPlan={{
              id: "plan-1",
              userId: "user-1",
              planName: "Furniture Plan",
              designBrief: { description: "Furniture design" },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              components: components as any,
              materials: materials as any,
              hardware: hardware as any,
              joinery: [],
              cutList: cutList as any,
              billOfMaterials: [],
              assemblyInstructions: assemblySteps as any,
              status: "Draft",
              version: 1,
            }}
            onExport={(format, section) => {
              console.log(`Exported ${section} as ${format}`);
            }}
          />
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="cutlist">Cut List</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="hardware">Hardware</TabsTrigger>
          <TabsTrigger value="assembly">Assembly</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="mt-2">
          <Card>
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Dimensions (L × W × T)</TableHead>
                    <TableHead>Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {components.length > 0 ? (
                    components.map((component) => (
                      <TableRow key={component.id}>
                        <TableCell>{component.name}</TableCell>
                        <TableCell>
                          {component.material || component.materialId}
                        </TableCell>
                        <TableCell>
                          {typeof component.dimensions === "object"
                            ? `${component.dimensions.length}" × ${component.dimensions.width}" × ${component.dimensions.thickness}"`
                            : component.dimensions || "N/A"}
                        </TableCell>
                        <TableCell>{component.quantity}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No components available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cutlist" className="mt-2">
          <Card>
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Dimensions (L × W × T)</TableHead>
                    <TableHead>Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cutList.length > 0 ? (
                    cutList.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {item.componentName || item.name || item.partName}
                        </TableCell>
                        <TableCell>{item.material}</TableCell>
                        <TableCell>
                          {item.dimensions
                            ? `${item.dimensions.length}" × ${item.dimensions.width}" × ${item.dimensions.thickness}"`
                            : `${item.length || "N/A"} × ${item.width || "N/A"} × ${item.thickness || "N/A"}`}
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No cut list available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="mt-2">
          <Card>
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.length > 0 ? (
                    materials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell>{material.name}</TableCell>
                        <TableCell>{material.type}</TableCell>
                        <TableCell>{material.quantity}</TableCell>
                        <TableCell>{material.unit || "units"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No materials available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hardware" className="mt-2">
          <Card>
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hardware.length > 0 ? (
                    hardware.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.size || "Standard"}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No hardware available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assembly" className="mt-2">
          <Card>
            <CardContent className="p-4">
              {assemblySteps.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        Step {currentStep + 1} of {assemblySteps.length}
                      </span>
                      <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300 ease-in-out"
                          style={{
                            width: `${((currentStep + 1) / assemblySteps.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div
                      key={assemblySteps[currentStep].id}
                      className="flex gap-6"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                        {assemblySteps[currentStep].stepNumber}
                      </div>
                      <div className="flex-1">
                        <p className="text-lg mb-3">
                          {assemblySteps[currentStep].description}
                        </p>
                        {assemblySteps[currentStep].imageUrl && (
                          <div className="rounded-md overflow-hidden h-48 w-full">
                            <img
                              src={assemblySteps[currentStep].imageUrl}
                              alt={`Step ${assemblySteps[currentStep].stepNumber}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentStep((prev) => Math.max(0, prev - 1))
                      }
                      disabled={currentStep === 0}
                    >
                      Previous Step
                    </Button>
                    <Button
                      onClick={() =>
                        setCurrentStep((prev) =>
                          Math.min(assemblySteps.length - 1, prev + 1),
                        )
                      }
                      disabled={currentStep === assemblySteps.length - 1}
                    >
                      Next Step
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p>No assembly steps available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BuildPlanTabs;
