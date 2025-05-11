import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

function Box(props: any) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
      // Add a gentle bobbing motion
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <mesh {...props} ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={props.color || "#777777"} />
    </mesh>
  );
}

function Table() {
  return (
    <group position={[0, 0, 0]}>
      {/* Table top */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Table legs */}
      <mesh position={[-0.8, 0.35, -0.4]}>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0.8, 0.35, -0.4]}>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[-0.8, 0.35, 0.4]}>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0.8, 0.35, 0.4]}>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    </group>
  );
}

interface ModelViewerProps {
  modelType?: "table" | "chair" | "desk" | "bookshelf" | "box" | "custom";
  backgroundColor?: string;
  showControls?: boolean;
  customModelUrl?: string;
  rotationSpeed?: number;
  showGrid?: boolean;
  materialColor?: string;
}

function Chair() {
  return (
    <group position={[0, 0, 0]}>
      {/* Seat */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 0.1, 0.8]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>

      {/* Back */}
      <mesh position={[0, 1.2, -0.35]}>
        <boxGeometry args={[0.8, 1.3, 0.1]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.3, 0.25, -0.3]}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
      <mesh position={[0.3, 0.25, -0.3]}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
      <mesh position={[-0.3, 0.25, 0.3]}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
      <mesh position={[0.3, 0.25, 0.3]}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
    </group>
  );
}

function Desk() {
  return (
    <group position={[0, 0, 0]}>
      {/* Desktop */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[2.2, 0.1, 1.2]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>

      {/* Legs */}
      <mesh position={[-1, 0.45, -0.5]}>
        <boxGeometry args={[0.1, 0.9, 0.1]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>
      <mesh position={[1, 0.45, -0.5]}>
        <boxGeometry args={[0.1, 0.9, 0.1]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>
      <mesh position={[-1, 0.45, 0.5]}>
        <boxGeometry args={[0.1, 0.9, 0.1]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>
      <mesh position={[1, 0.45, 0.5]}>
        <boxGeometry args={[0.1, 0.9, 0.1]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>

      {/* Drawer */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.8, 0.3, 1]} />
        <meshStandardMaterial color="#6F4E37" />
      </mesh>
    </group>
  );
}

function Bookshelf() {
  return (
    <group position={[0, 0, 0]}>
      {/* Back panel */}
      <mesh position={[0, 1, -0.4]}>
        <boxGeometry args={[1.5, 2, 0.05]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Side panels */}
      <mesh position={[-0.725, 1, 0]}>
        <boxGeometry args={[0.05, 2, 0.8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0.725, 1, 0]}>
        <boxGeometry args={[0.05, 2, 0.8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Shelves */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.05, 0.8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[1.5, 0.05, 0.8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[1.5, 0.05, 0.8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[1.5, 0.05, 0.8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    </group>
  );
}

function CustomModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1} position={[0, 0, 0]} />;
}

const ModelViewer = ({
  modelType = "table",
  backgroundColor = "#f5f5f5",
  showControls = true,
  customModelUrl = "",
  rotationSpeed = 0.5,
  showGrid = false,
  materialColor = "#8B4513",
}: ModelViewerProps) => {
  return (
    <div className="w-full h-full bg-background border rounded-lg overflow-hidden">
      <Canvas style={{ background: backgroundColor }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />

          {modelType === "box" && <Box position={[0, 0, 0]} color="#6366f1" />}
          {modelType === "table" && <Table />}
          {modelType === "chair" && <Chair />}
          {modelType === "desk" && <Desk />}
          {modelType === "bookshelf" && <Bookshelf />}
          {modelType === "custom" && customModelUrl && (
            <CustomModel url={customModelUrl} />
          )}

          {showControls && <OrbitControls />}
          <PerspectiveCamera makeDefault position={[0, 1, 3]} />
          <Environment preset="sunset" />
          {showGrid && <gridHelper args={[10, 10]} />}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ModelViewer;
