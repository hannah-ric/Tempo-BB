import React from "react";
import { BuildPlan } from "../types/design";
import { generateModelFromBuildPlan } from "../../services/modelGeneratorService";

interface DynamicFurnitureProps {
  buildPlan: BuildPlan;
  materialColor?: string;
}

const DynamicFurniture: React.FC<DynamicFurnitureProps> = ({
  buildPlan,
  materialColor = "#8B4513",
}) => {
  // Generate all component meshes from the build plan
  const componentMeshes = generateModelFromBuildPlan(buildPlan, materialColor);

  return (
    <group position={[0, 0, 0]}>
      {componentMeshes.map((mesh) => (
        <mesh key={mesh.key} position={mesh.position}>
          <boxGeometry args={mesh.dimensions} />
          <meshStandardMaterial color={mesh.color} />
        </mesh>
      ))}
    </group>
  );
};

export default DynamicFurniture;
