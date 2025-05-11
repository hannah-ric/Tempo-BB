import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import {
  getLumberMaterials,
  getSheetMaterials,
  getOtherMaterials,
} from "@/lib/database";
import {
  LumberMaterial,
  SheetMaterial,
  OtherMaterial,
} from "@/types/furniture";

interface MaterialSelectorProps {
  onSelectMaterial?: (materialName: string, materialType: string) => void;
  selectedMaterial?: string;
}

const MaterialSelector = ({
  onSelectMaterial = () => {},
  selectedMaterial = "",
}: MaterialSelectorProps) => {
  const [activeTab, setActiveTab] = useState("lumber");
  const [lumberMaterials, setLumberMaterials] = useState<LumberMaterial[]>([]);
  const [sheetMaterials, setSheetMaterials] = useState<SheetMaterial[]>([]);
  const [otherMaterials, setOtherMaterials] = useState<OtherMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoading(true);
      try {
        const lumber = await getLumberMaterials();
        const sheet = await getSheetMaterials();
        const other = await getOtherMaterials();

        setLumberMaterials(lumber);
        setSheetMaterials(sheet);
        setOtherMaterials(other);
      } catch (error) {
        console.error("Error fetching materials:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  // Fallback data in case the database is empty
  const fallbackLumber = [
    {
      id: "1",
      nominal_size: "2x4",
      actual_size: { in: [1.5, 3.5], mm: [38, 89] },
      common_lengths: {
        imperial: [8, 10, 12, 14, 16],
        metric: [2438, 3048, 3658, 4267, 4877],
      },
      tolerances: "±0.125 in on actual dimensions due to planing variations",
      notes:
        "A standard 2x4 is used for framing; actual dimensions are approximately 1.5 × 3.5 inches.",
    },
    {
      id: "2",
      nominal_size: "1x6",
      actual_size: { in: [0.75, 5.5], mm: [19, 140] },
      common_lengths: {
        imperial: [6, 8, 10, 12],
        metric: [1829, 2438, 3048, 3658],
      },
      tolerances: "±0.0625 in on thickness due to planing",
      notes: "Commonly used for trim, shelving, and furniture.",
    },
  ];

  const fallbackSheet = [
    {
      id: "1",
      type: "Plywood",
      nominal_sheet_size: { ft: [4, 8], mm: [1219, 2438] },
      thickness_options: [
        { in: 0.25, mm: 6 },
        { in: 0.5, mm: 12 },
        { in: 0.75, mm: 19 },
      ],
      tolerances: "Thickness can vary ±0.1 in; sheet dimensions ±0.25 in",
      notes:
        "Standard plywood sheets are used in cabinetry and structural panels.",
    },
    {
      id: "2",
      type: "MDF",
      nominal_sheet_size: { ft: [4, 8], mm: [1219, 2438] },
      thickness_options: [
        { in: 0.5, mm: 12 },
        { in: 0.75, mm: 19 },
      ],
      tolerances: "Thickness ±0.05 in; dimensions may vary slightly.",
      notes:
        "Medium Density Fiberboard is smooth, ideal for painting; however, not water resistant.",
    },
  ];

  const fallbackOther = [
    {
      id: "1",
      name: "Oak",
      type: "Hardwood",
      density: {
        imperial: { value: 45, unit: "lb/ft³" },
        metric: { value: 720, unit: "kg/m³" },
      },
      modulus_elasticity: {
        imperial: null,
        metric: { value: 11, unit: "GPa" },
      },
      notes:
        "Durable hardwood with prominent grain pattern. Good for furniture.",
    },
    {
      id: "2",
      name: "Maple",
      type: "Hardwood",
      density: {
        imperial: { value: 44, unit: "lb/ft³" },
        metric: { value: 705, unit: "kg/m³" },
      },
      modulus_elasticity: {
        imperial: null,
        metric: { value: 10, unit: "GPa" },
      },
      notes:
        "Hard, light-colored wood with fine grain. Excellent for furniture.",
    },
    {
      id: "3",
      name: "Walnut",
      type: "Hardwood",
      density: {
        imperial: { value: 40, unit: "lb/ft³" },
        metric: { value: 640, unit: "kg/m³" },
      },
      modulus_elasticity: {
        imperial: null,
        metric: { value: 10, unit: "GPa" },
      },
      notes:
        "Dark, rich-colored wood with straight grain. Premium furniture choice.",
    },
  ];

  const displayLumber =
    lumberMaterials.length > 0 ? lumberMaterials : fallbackLumber;
  const displaySheet =
    sheetMaterials.length > 0 ? sheetMaterials : fallbackSheet;
  const displayOther =
    otherMaterials.length > 0 ? otherMaterials : fallbackOther;

  return (
    <Card className="w-full bg-background border rounded-lg">
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-4">Material Selection</h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="lumber">Lumber</TabsTrigger>
            <TabsTrigger value="sheet">Sheet Goods</TabsTrigger>
            <TabsTrigger value="other">Other Materials</TabsTrigger>
          </TabsList>

          <TabsContent value="lumber" className="mt-2">
            {isLoading ? (
              <div className="flex justify-center p-4">
                Loading materials...
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Size</TableHead>
                    <TableHead>Actual Dimensions</TableHead>
                    <TableHead>Common Lengths</TableHead>
                    <TableHead>Select</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayLumber.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell>{material.nominal_size}</TableCell>
                      <TableCell>
                        {material.actual_size.in[0]}" ×{" "}
                        {material.actual_size.in[1]}"
                      </TableCell>
                      <TableCell>
                        {material.common_lengths.imperial.join(", ")}'
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={
                            selectedMaterial === material.nominal_size
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            onSelectMaterial(material.nominal_size, "lumber")
                          }
                        >
                          {selectedMaterial === material.nominal_size && (
                            <Check className="h-4 w-4 mr-1" />
                          )}
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          <TabsContent value="sheet" className="mt-2">
            {isLoading ? (
              <div className="flex justify-center p-4">
                Loading materials...
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Sheet Size</TableHead>
                    <TableHead>Thickness Options</TableHead>
                    <TableHead>Select</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displaySheet.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell>{material.type}</TableCell>
                      <TableCell>
                        {material.nominal_sheet_size.ft[0]}' ×{" "}
                        {material.nominal_sheet_size.ft[1]}'
                      </TableCell>
                      <TableCell>
                        {material.thickness_options.map((t) => `${t.in}"`)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={
                            selectedMaterial === material.type
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            onSelectMaterial(material.type, "sheet")
                          }
                        >
                          {selectedMaterial === material.type && (
                            <Check className="h-4 w-4 mr-1" />
                          )}
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          <TabsContent value="other" className="mt-2">
            {isLoading ? (
              <div className="flex justify-center p-4">
                Loading materials...
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Density</TableHead>
                    <TableHead>Select</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayOther.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell>{material.name}</TableCell>
                      <TableCell>{material.type}</TableCell>
                      <TableCell>
                        {material.density.imperial?.value}{" "}
                        {material.density.imperial?.unit}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={
                            selectedMaterial === material.name
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            onSelectMaterial(material.name, "other")
                          }
                        >
                          {selectedMaterial === material.name && (
                            <Check className="h-4 w-4 mr-1" />
                          )}
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MaterialSelector;
