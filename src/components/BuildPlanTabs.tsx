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
import { Download, Printer, Share2 } from "lucide-react";

interface Component {
  id: string;
  name: string;
  material: string;
  dimensions: {
    length: number;
    width: number;
    thickness: number;
  };
  quantity: number;
}

interface Material {
  id: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
}

interface Hardware {
  id: string;
  name: string;
  type: string;
  size: string;
  quantity: number;
}

interface AssemblyStep {
  id: string;
  stepNumber: number;
  description: string;
  imageUrl?: string;
}

interface BuildPlanTabsProps {
  components?: Component[];
  cutList?: Component[];
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

  return (
    <div className="w-full bg-background border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Build Plan</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
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
              <div className="space-y-8">
                {assemblySteps.length > 0 ? (
                  assemblySteps.map((step) => (
                    <div key={step.id} className="flex gap-6">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                        {step.stepNumber}
                      </div>
                      <div className="flex-1">
                        <p className="text-lg mb-3">{step.description}</p>
                        {step.imageUrl && (
                          <div className="rounded-md overflow-hidden h-48 w-full">
                            <img
                              src={step.imageUrl}
                              alt={`Step ${step.stepNumber}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p>No assembly steps available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BuildPlanTabs;
