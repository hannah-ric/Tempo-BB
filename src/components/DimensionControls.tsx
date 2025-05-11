import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DimensionControlsProps {
  dimensions: Record<string, number>;
  onDimensionChange: (key: string, value: number) => void;
  minValues?: Record<string, number>;
  maxValues?: Record<string, number>;
  stepValues?: Record<string, number>;
}

const DimensionControls = ({
  dimensions,
  onDimensionChange,
  minValues = {},
  maxValues = {},
  stepValues = {},
}: DimensionControlsProps) => {
  // Default min, max, and step values if not provided
  const getMinValue = (key: string) => minValues[key] || 1;
  const getMaxValue = (key: string) => maxValues[key] || 100;
  const getStepValue = (key: string) => stepValues[key] || 1;

  const handleSliderChange = (key: string, value: number[]) => {
    onDimensionChange(key, value[0]);
  };

  const handleInputChange = (key: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      // Clamp the value between min and max
      const min = getMinValue(key);
      const max = getMaxValue(key);
      const clampedValue = Math.min(Math.max(numValue, min), max);
      onDimensionChange(key, clampedValue);
    }
  };

  return (
    <Card className="w-full bg-background border rounded-lg">
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-4">Dimensions</h2>
        <div className="space-y-6">
          {Object.entries(dimensions).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor={`dimension-${key}`}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Label>
                <div className="flex items-center">
                  <Input
                    id={`dimension-input-${key}`}
                    type="number"
                    value={value}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="w-16 h-8 text-right"
                    min={getMinValue(key)}
                    max={getMaxValue(key)}
                    step={getStepValue(key)}
                  />
                  <span className="ml-1">"</span>
                </div>
              </div>
              <Slider
                id={`dimension-${key}`}
                min={getMinValue(key)}
                max={getMaxValue(key)}
                step={getStepValue(key)}
                value={[value]}
                onValueChange={(val) => handleSliderChange(key, val)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{getMinValue(key)}"</span>
                <span>{getMaxValue(key)}"</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DimensionControls;
