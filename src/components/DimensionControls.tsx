import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the keys for dimensions explicitly for type safety and iteration
const DIMENSION_KEYS = ["length", "width", "height", "depth"] as const;
type DimensionKey = typeof DIMENSION_KEYS[number];

interface DimensionControlsProps {
  dimensions: {
    length?: string;
    width?: string;
    height?: string;
    depth?: string;
    units?: "in" | "cm" | "mm";
  };
  onDimensionChange: (key: DimensionKey | "units", value: string) => void;
  minValues?: Partial<Record<DimensionKey, number>>;
  maxValues?: Partial<Record<DimensionKey, number>>;
  stepValues?: Partial<Record<DimensionKey, number>>;
}

const DimensionControls = ({
  dimensions,
  onDimensionChange,
  minValues = {},
  maxValues = {},
  stepValues = {},
}: DimensionControlsProps) => {
  const currentUnits = dimensions.units || "in";

  const getMinValue = (key: DimensionKey) => minValues[key] || 1;
  const getMaxValue = (key: DimensionKey) => maxValues[key] || (currentUnits === "in" ? 120 : currentUnits === "cm" ? 300 : 3000); // Adjusted default max based on unit
  const getStepValue = (key: DimensionKey) => stepValues[key] || 1;

  const handleSliderChange = (key: DimensionKey, sliderValue: number[]) => {
    onDimensionChange(key, sliderValue[0].toString());
  };

  const handleInputChange = (key: DimensionKey, inputValue: string) => {
    // Allow empty input for clearing, or parse to number if not empty
    if (inputValue === "") {
      onDimensionChange(key, ""); 
      return;
    }
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      // Clamping should ideally happen based on consistent units or be handled by the parent if conversions are complex
      // For now, let's assume clamping is done with the current unit
      const min = getMinValue(key);
      const max = getMaxValue(key);
      const clampedValue = Math.min(Math.max(numValue, min), max);
      onDimensionChange(key, clampedValue.toString());
    } else if (inputValue === "-") { // Allow typing negative for input flexibility, though min might be positive
        onDimensionChange(key, "-");
    }
  };

  const handleUnitChange = (newUnit: string) => {
    if (newUnit === "in" || newUnit === "cm" || newUnit === "mm") {
      onDimensionChange("units", newUnit);
    }
  };

  return (
    <Card className="w-full bg-background border rounded-lg">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Dimensions</h2>
          <Select value={currentUnits} onValueChange={handleUnitChange}>
            <SelectTrigger className="w-[80px] h-8">
              <SelectValue placeholder="Units" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in">Inches</SelectItem>
              <SelectItem value="cm">CM</SelectItem>
              <SelectItem value="mm">MM</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-6">
          {DIMENSION_KEYS.map((key) => {
            const valueStr = dimensions[key] || "0"; // Default to string "0" if undefined for input
            const valueNum = parseFloat(valueStr);
            const displayValue = isNaN(valueNum) && valueStr !== "-" ? 0 : valueNum; // Use 0 for slider if NaN, unless it's just a hyphen

            // Only render dimension if its key is present or it's a common one like L/W/H
            // For this version, we render all defined in DIMENSION_KEYS
            // but one could add a check: `if (dimensions[key] === undefined && !['length','width','height'].includes(key)) return null;`

            return (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor={`dimension-${key}`}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id={`dimension-input-${key}`}
                      type="text" // Changed to text to allow empty string or hyphen temporarily
                      value={dimensions[key] === undefined ? "" : valueStr} // Show empty if undefined
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-20 h-8 text-right tabular-nums"
                      placeholder="0"
                      // min={getMinValue(key)} // HTML5 min/max not ideal with string type and custom parsing
                      // max={getMaxValue(key)}
                      // step={getStepValue(key)}
                    />
                    <span className="ml-1 min-w-[25px] text-left">{currentUnits}</span>
                  </div>
                </div>
                <Slider
                  id={`dimension-${key}`}
                  min={getMinValue(key)}
                  max={getMaxValue(key)}
                  step={getStepValue(key)}
                  value={[isNaN(displayValue) ? getMinValue(key) : displayValue]} // Fallback for slider if value is NaN
                  onValueChange={(val) => handleSliderChange(key, val)}
                  disabled={dimensions[key] === undefined || valueStr === "-"} // Disable slider if input is undefined or just hyphen
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{getMinValue(key)}{currentUnits}</span>
                  <span>{getMaxValue(key)}{currentUnits}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DimensionControls;
