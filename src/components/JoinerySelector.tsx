import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface JoineryMethod {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface JoinerySelectorProps {
  selectedMethods?: string[];
  onJoineryChange: (methods: string[]) => void;
  joineryMethods?: JoineryMethod[];
}

const JoinerySelector = ({
  selectedMethods = [],
  onJoineryChange,
  joineryMethods = [
    {
      id: "mortise-and-tenon",
      name: "Mortise and Tenon",
      description:
        "Strong traditional joint where a tenon fits into a mortise hole.",
      imageUrl:
        "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=300&q=80",
      difficulty: "intermediate",
    },
    {
      id: "dovetail",
      name: "Dovetail",
      description:
        "Interlocking wedge-shaped tails and pins for strong drawer joints.",
      imageUrl:
        "https://images.unsplash.com/photo-1601058269202-47d5f451cd3f?w=300&q=80",
      difficulty: "advanced",
    },
    {
      id: "pocket-hole",
      name: "Pocket Hole",
      description: "Quick and easy joint using angled holes and screws.",
      imageUrl:
        "https://images.unsplash.com/photo-1598106755735-4f9a147d6c84?w=300&q=80",
      difficulty: "beginner",
    },
    {
      id: "butt-joint",
      name: "Butt Joint",
      description: "Simple joint where two pieces meet at right angles.",
      imageUrl:
        "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=300&q=80",
      difficulty: "beginner",
    },
    {
      id: "miter-joint",
      name: "Miter Joint",
      description: "Angled joint where two pieces meet at a corner.",
      imageUrl:
        "https://images.unsplash.com/photo-1622043945901-080c9c1c7af0?w=300&q=80",
      difficulty: "intermediate",
    },
  ],
}: JoinerySelectorProps) => {
  const toggleJoineryMethod = (methodId: string) => {
    if (selectedMethods.includes(methodId)) {
      onJoineryChange(selectedMethods.filter((id) => id !== methodId));
    } else {
      onJoineryChange([...selectedMethods, methodId]);
    }
  };

  // Convert display names to IDs for comparison
  const selectedMethodIds = selectedMethods.map((method) =>
    method.toLowerCase().replace(/ and /g, "-and-").replace(/ /g, "-"),
  );

  return (
    <Card className="w-full bg-background border rounded-lg">
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-4">Joinery Methods</h2>
        <div className="grid grid-cols-1 gap-4">
          {joineryMethods.map((method) => {
            const isSelected = selectedMethodIds.includes(method.id);
            return (
              <div
                key={method.id}
                className={`flex border rounded-lg p-2 cursor-pointer transition-all ${isSelected ? "border-primary ring-2 ring-primary/20" : "hover:border-muted-foreground"}`}
                onClick={() => toggleJoineryMethod(method.id)}
              >
                <div className="flex-shrink-0 w-20 h-20 rounded overflow-hidden mr-3">
                  <img
                    src={method.imageUrl}
                    alt={method.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center">
                    <Checkbox
                      id={`joinery-${method.id}`}
                      checked={isSelected}
                      onCheckedChange={() => toggleJoineryMethod(method.id)}
                      className="mr-2"
                    />
                    <Label
                      htmlFor={`joinery-${method.id}`}
                      className="font-medium"
                    >
                      {method.name}
                      <span
                        className={`ml-2 text-xs px-2 py-0.5 rounded-full ${method.difficulty === "beginner" ? "bg-green-100 text-green-800" : method.difficulty === "intermediate" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                      >
                        {method.difficulty}
                      </span>
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {method.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default JoinerySelector;
