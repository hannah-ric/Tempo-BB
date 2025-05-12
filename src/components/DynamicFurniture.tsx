import React, { useEffect, useState, useRef } from "react";
import { BuildPlan } from "../types/design";
import { generateModelFromBuildPlan } from "../../services/modelGeneratorService";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";

interface DynamicFurnitureProps {
  buildPlan: BuildPlan;
  materialColor?: string;
  viewMode?: "assembled" | "exploded" | "animated";
  rotationSpeed?: number;
}

const DynamicFurniture: React.FC<DynamicFurnitureProps> = ({
  buildPlan,
  materialColor = "#8B4513",
  viewMode = "assembled",
  rotationSpeed = 0,
}) => {
  // Generate all component meshes from the build plan
  const componentMeshes = generateModelFromBuildPlan(buildPlan, materialColor);
  const [explodeDistance, setExplodeDistance] = useState(0);
  const [targetExplodeDistance, setTargetExplodeDistance] = useState(0);
  const [animationPhase, setAnimationPhase] = useState(0);
  const groupRef = useRef<THREE.Group>(null);

  // Update target explode distance when viewMode changes
  useEffect(() => {
    if (viewMode === "exploded") {
      setTargetExplodeDistance(1.5);
    } else if (viewMode === "animated") {
      setTargetExplodeDistance(0);
      setAnimationPhase(0);
    } else {
      setTargetExplodeDistance(0);
    }
  }, [viewMode]);

  // Animate the explode effect
  useFrame(({ clock }) => {
    // Handle explode animation
    if (Math.abs(explodeDistance - targetExplodeDistance) > 0.01) {
      setExplodeDistance((prev) => {
        const step = (targetExplodeDistance - prev) * 0.1;
        return prev + step;
      });
    }

    // Handle rotation if enabled
    if (groupRef.current && rotationSpeed > 0) {
      groupRef.current.rotation.y += rotationSpeed * 0.01;
    }

    // Handle assembly animation
    if (viewMode === "animated") {
      const time = clock.getElapsedTime();
      // Cycle through animation phases every 3 seconds
      const newPhase = Math.floor((time % 9) / 3);
      if (newPhase !== animationPhase) {
        setAnimationPhase(newPhase);
        // Phase 0: Assembled
        // Phase 1: Exploded
        // Phase 2: Back to assembled
        setTargetExplodeDistance(newPhase === 1 ? 1.5 : 0);
      }
    }
  });

  return (
    <group position={[0, 0, 0]} ref={groupRef}>
      {componentMeshes.map((mesh, index) => {
        // Calculate exploded position - move components outward from center
        const explodedPosition = [
          mesh.position[0] * (1 + explodeDistance * 0.5),
          mesh.position[1] + explodeDistance * 0.5, // Add height instead of multiplying
          mesh.position[2] * (1 + explodeDistance * 0.5),
        ] as [number, number, number];

        // Use the exploded position when in exploded or animated mode, otherwise use original position
        const finalPosition =
          viewMode === "exploded" || viewMode === "animated"
            ? explodedPosition
            : mesh.position;

        // Add a slight delay to each component in animated mode
        const animationDelay = index * 0.1;

        return (
          <mesh
            key={mesh.key}
            position={finalPosition}
            userData={{ name: mesh.name }}
          >
            <boxGeometry args={mesh.dimensions} />
            <meshStandardMaterial
              color={mesh.color}
              roughness={0.7}
              metalness={0.1}
              transparent={true}
              opacity={viewMode === "animated" ? 0.9 : 1.0}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default DynamicFurniture;
