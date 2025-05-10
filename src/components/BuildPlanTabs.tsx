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
  components = [
    {
      id: "1",
      name: "Table Top",
      material: "Maple",
      dimensions: { length: 60, width: 30, thickness: 1.5 },
      quantity: 1,
    },
    {
      id: "2",
      name: "Leg",
      material: "Maple",
      dimensions: { length: 29, width: 2, thickness: 2 },
      quantity: 4,
    },
    {
      id: "3",
      name: "Apron",
      material: "Maple",
      dimensions: { length: 56, width: 4, thickness: 0.75 },
      quantity: 2,
    },
    {
      id: "4",
      name: "Apron",
      material: "Maple",
      dimensions: { length: 26, width: 4, thickness: 0.75 },
      quantity: 2,
    },
  ],
  cutList = [
    {
      id: "1",
      name: "Table Top",
      material: "Maple",
      dimensions: { length: 60, width: 30, thickness: 1.5 },
      quantity: 1,
    },
    {
      id: "2",
      name: "Leg",
      material: "Maple",
      dimensions: { length: 29, width: 2, thickness: 2 },
      quantity: 4,
    },
    {
      id: "3",
      name: "Apron",
      material: "Maple",
      dimensions: { length: 56, width: 4, thickness: 0.75 },
      quantity: 2,
    },
    {
      id: "4",
      name: "Apron",
      material: "Maple",
      dimensions: { length: 26, width: 4, thickness: 0.75 },
      quantity: 2,
    },
  ],
  materials = [
    {
      id: "1",
      name: "Maple",
      type: "Hardwood",
      quantity: 25,
      unit: "board feet",
    },
    {
      id: "2",
      name: "Wood Glue",
      type: "Adhesive",
      quantity: 1,
      unit: "bottle",
    },
    {
      id: "3",
      name: "Finish",
      type: "Polyurethane",
      quantity: 1,
      unit: "quart",
    },
  ],
  hardware = [
    {
      id: "1",
      name: "Corner Bracket",
      type: "Bracket",
      size: '2"',
      quantity: 4,
    },
    {
      id: "2",
      name: "Wood Screw",
      type: "Screw",
      size: '1.5" #8',
      quantity: 16,
    },
    {
      id: "3",
      name: "Table Top Fastener",
      type: "Fastener",
      size: "Standard",
      quantity: 8,
    },
  ],
  assemblySteps = [
    {
      id: "1",
      stepNumber: 1,
      description: "Cut all pieces according to the cut list dimensions.",
      imageUrl:
        "https://images.unsplash.com/photo-1567604130959-7a3d8a8ecd8c?w=600&q=80",
    },
    {
      id: "2",
      stepNumber: 2,
      description:
        "Sand all pieces to 220 grit, starting with 80, then 120, then 220.",
      imageUrl:
        "https://images.unsplash.com/photo-1622043945901-080c9c1c7af0?w=600&q=80",
    },
    {
      id: "3",
      stepNumber: 3,
      description:
        "Attach the aprons to the legs using corner brackets and wood screws.",
      imageUrl:
        "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=600&q=80",
    },
    {
      id: "4",
      stepNumber: 4,
      description:
        "Attach the table top to the base using table top fasteners.",
      imageUrl:
        "https://images.unsplash.com/photo-1598106755735-4f9a147d6c84?w=600&q=80",
    },
    {
      id: "5",
      stepNumber: 5,
      description:
        "Apply finish according to manufacturer instructions, allowing proper drying time between coats.",
      imageUrl:
        "https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?w=600&q=80",
    },
  ],
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
                  {components.map((component) => (
                    <TableRow key={component.id}>
                      <TableCell>{component.name}</TableCell>
                      <TableCell>{component.material}</TableCell>
                      <TableCell>
                        {component.dimensions.length}" ×{" "}
                        {component.dimensions.width}" ×{" "}
                        {component.dimensions.thickness}"
                      </TableCell>
                      <TableCell>{component.quantity}</TableCell>
                    </TableRow>
                  ))}
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
                  {cutList.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.material}</TableCell>
                      <TableCell>
                        {item.dimensions.length}" × {item.dimensions.width}" ×{" "}
                        {item.dimensions.thickness}"
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                    </TableRow>
                  ))}
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
                  {materials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell>{material.name}</TableCell>
                      <TableCell>{material.type}</TableCell>
                      <TableCell>{material.quantity}</TableCell>
                      <TableCell>{material.unit}</TableCell>
                    </TableRow>
                  ))}
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
                  {hardware.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assembly" className="mt-2">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-8">
                {assemblySteps.map((step) => (
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
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BuildPlanTabs;
