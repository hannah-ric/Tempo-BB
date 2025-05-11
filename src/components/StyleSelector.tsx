import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface FurnitureStyle {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  styles?: FurnitureStyle[];
}

const StyleSelector = ({
  selectedStyle,
  onStyleChange,
  styles = [
    {
      id: "modern",
      name: "Modern",
      description: "Clean lines, minimalist approach, and neutral colors.",
      imageUrl:
        "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300&q=80",
    },
    {
      id: "mid-century",
      name: "Mid-Century Modern",
      description: "Organic shapes, clean lines, and minimal ornamentation.",
      imageUrl:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80",
    },
    {
      id: "traditional",
      name: "Traditional",
      description: "Classic design with ornate details and rich wood tones.",
      imageUrl:
        "https://images.unsplash.com/photo-1560448075-bb485b067938?w=300&q=80",
    },
    {
      id: "industrial",
      name: "Industrial",
      description: "Raw materials, exposed elements, and utilitarian design.",
      imageUrl:
        "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=300&q=80",
    },
    {
      id: "scandinavian",
      name: "Scandinavian",
      description: "Light colors, natural materials, and functional design.",
      imageUrl:
        "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=300&q=80",
    },
  ],
}: StyleSelectorProps) => {
  return (
    <Card className="w-full bg-background border rounded-lg">
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-4">Furniture Style</h2>
        <RadioGroup
          value={selectedStyle}
          onValueChange={onStyleChange}
          className="grid grid-cols-1 gap-4"
        >
          {styles.map((style) => (
            <div
              key={style.id}
              className={`flex border rounded-lg p-2 cursor-pointer transition-all ${selectedStyle === style.id ? "border-primary ring-2 ring-primary/20" : "hover:border-muted-foreground"}`}
              onClick={() => onStyleChange(style.id)}
            >
              <div className="flex-shrink-0 w-20 h-20 rounded overflow-hidden mr-3">
                <img
                  src={style.imageUrl}
                  alt={style.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-center">
                  <RadioGroupItem
                    value={style.id}
                    id={`style-${style.id}`}
                    className="mr-2"
                  />
                  <Label htmlFor={`style-${style.id}`} className="font-medium">
                    {style.name}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {style.description}
                </p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default StyleSelector;
