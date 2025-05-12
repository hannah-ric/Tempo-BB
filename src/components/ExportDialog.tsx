import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BuildPlan } from "@/types/design";
import { Download, FileJson, FileSpreadsheet, File } from "lucide-react";

interface ExportDialogProps {
  buildPlan?: BuildPlan;
  onExport?: (format: string, section: string) => void;
}

const ExportDialog = ({
  buildPlan,
  onExport = () => {},
}: ExportDialogProps) => {
  const [open, setOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"json" | "csv" | "pdf">(
    "json",
  );
  const [exportSection, setExportSection] = useState<
    "all" | "components" | "cutlist" | "bom" | "assembly"
  >("all");

  const handleExport = async () => {
    if (!buildPlan) {
      console.error("No build plan available for export");
      return;
    }

    try {
      let exportData;
      let fileName;

      // Determine which data to export based on section
      switch (exportSection) {
        case "components":
          exportData = buildPlan.components;
          fileName = `${buildPlan.planName.replace(/\s+/g, "_")}_components`;
          break;
        case "cutlist":
          exportData = buildPlan.cutList;
          fileName = `${buildPlan.planName.replace(/\s+/g, "_")}_cutlist`;
          break;
        case "bom":
          exportData = buildPlan.billOfMaterials;
          fileName = `${buildPlan.planName.replace(/\s+/g, "_")}_bom`;
          break;
        case "assembly":
          exportData = buildPlan.assemblyInstructions;
          fileName = `${buildPlan.planName.replace(/\s+/g, "_")}_assembly`;
          break;
        case "all":
        default:
          exportData = buildPlan;
          fileName = buildPlan.planName.replace(/\s+/g, "_");
          break;
      }

      // Handle different export formats
      switch (exportFormat) {
        case "json":
          // Export as JSON
          const jsonString = JSON.stringify(exportData, null, 2);
          const jsonBlob = new Blob([jsonString], { type: "application/json" });
          downloadBlob(jsonBlob, `${fileName}.json`);
          break;

        case "csv":
          // Export as CSV
          const csvContent = convertToCSV(exportData, exportSection);
          const csvBlob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
          });
          downloadBlob(csvBlob, `${fileName}.csv`);
          break;

        case "pdf":
          // For PDF, we'll just show a message for now
          alert("PDF export will be implemented in a future update");
          break;
      }

      onExport(exportFormat, exportSection);
      setOpen(false);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data. Please try again.");
    }
  };

  // Helper function to download a blob as a file
  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  // Helper function to convert data to CSV format
  const convertToCSV = (data: any, section: string): string => {
    if (!data || data.length === 0) {
      return "";
    }

    // Handle different sections with appropriate column headers
    let headers: string[];
    let rows: string[];

    switch (section) {
      case "components":
        headers = ["Name", "Material", "Dimensions", "Quantity", "Description"];
        rows = data.map((item: any) => [
          item.name || "",
          item.materialId || item.material || "",
          typeof item.dimensions === "object"
            ? `${item.dimensions.length}" × ${item.dimensions.width}" × ${item.dimensions.thickness}"`
            : item.dimensions || "",
          item.quantity || "",
          item.description || "",
        ]);
        break;

      case "cutlist":
        headers = [
          "Component",
          "Part",
          "Material",
          "Length",
          "Width",
          "Thickness",
          "Quantity",
          "Notes",
        ];
        rows = data.map((item: any) => [
          item.componentName || "",
          item.partName || "",
          item.material || "",
          item.length || item.dimensions?.length || "",
          item.width || item.dimensions?.width || "",
          item.thickness || item.dimensions?.thickness || "",
          item.quantity || "",
          item.notes || "",
        ]);
        break;

      case "bom":
        headers = [
          "Item",
          "Type",
          "Quantity",
          "Unit Cost",
          "Total Cost",
          "Supplier",
          "Notes",
        ];
        rows = data.map((item: any) => [
          item.itemName || "",
          item.itemType || "",
          item.quantity || "",
          item.unitCost ? `${item.unitCost.toFixed(2)}` : "",
          item.totalCost ? `${item.totalCost.toFixed(2)}` : "",
          item.supplier || "",
          item.notes || "",
        ]);
        break;

      case "assembly":
        headers = [
          "Step",
          "Title",
          "Description",
          "Components",
          "Tools Required",
        ];
        rows = data.map((item: any) => [
          item.stepNumber || "",
          item.title || "",
          item.description || "",
          (item.componentsInvolved || []).join(", "),
          (item.toolsRequired || []).join(", "),
        ]);
        break;

      case "all":
      default:
        // For "all", we'll just export a summary
        headers = ["Section", "Count"];
        rows = [
          ["Components", (data.components || []).length.toString()],
          ["Materials", (data.materials || []).length.toString()],
          ["Hardware", (data.hardware || []).length.toString()],
          ["Cut List Items", (data.cutList || []).length.toString()],
          [
            "Assembly Steps",
            (data.assemblyInstructions || []).length.toString(),
          ],
        ];
        break;
    }

    // Convert headers and rows to CSV format
    const csvRows = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      ),
    ];

    return csvRows.join("\n");
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "json":
        return <FileJson className="h-4 w-4 mr-2" />;
      case "csv":
        return <FileSpreadsheet className="h-4 w-4 mr-2" />;
      case "pdf":
        return <File className="h-4 w-4 mr-2" />;
      default:
        return <Download className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Build Plan</DialogTitle>
          <DialogDescription>
            Choose the format and content you want to export.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <h3 className="text-sm font-medium mb-2">Export Format</h3>
          <div className="flex gap-2 mb-4">
            <Button
              variant={exportFormat === "json" ? "default" : "outline"}
              size="sm"
              onClick={() => setExportFormat("json")}
              className="flex-1"
            >
              <FileJson className="h-4 w-4 mr-2" />
              JSON
            </Button>
            <Button
              variant={exportFormat === "csv" ? "default" : "outline"}
              size="sm"
              onClick={() => setExportFormat("csv")}
              className="flex-1"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button
              variant={exportFormat === "pdf" ? "default" : "outline"}
              size="sm"
              onClick={() => setExportFormat("pdf")}
              className="flex-1"
            >
              <File className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>

          <h3 className="text-sm font-medium mb-2">Content to Export</h3>
          <Tabs
            value={exportSection}
            onValueChange={(value) => setExportSection(value as any)}
            className="w-full"
          >
            <TabsList className="grid grid-cols-5 mb-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="cutlist">Cut List</TabsTrigger>
              <TabsTrigger value="bom">BOM</TabsTrigger>
              <TabsTrigger value="assembly">Assembly</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="p-2 border rounded-md">
              Complete build plan including all components, cut list, bill of
              materials, and assembly instructions.
            </TabsContent>
            <TabsContent value="components" className="p-2 border rounded-md">
              Only the components list with dimensions and materials.
            </TabsContent>
            <TabsContent value="cutlist" className="p-2 border rounded-md">
              Detailed cut list for workshop use.
            </TabsContent>
            <TabsContent value="bom" className="p-2 border rounded-md">
              Bill of materials for purchasing supplies.
            </TabsContent>
            <TabsContent value="assembly" className="p-2 border rounded-md">
              Step-by-step assembly instructions.
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            {getFormatIcon(exportFormat)}
            Export {exportSection === "all" ? "Build Plan" : exportSection}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
