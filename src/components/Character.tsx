
import { useEffect, useState, useRef } from "react";
import { Character as CharacterType, fetchCharacter, Item } from "@/services/apiService";
import { Skeleton } from "@/components/ui/skeleton";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface CharacterProps {
  characterId: number;
  equippedItems: Record<string, Item | null>;
}

// VoxelCharacter component to render the 3D character and its equipment
const VoxelCharacter = ({ equippedItems }: { equippedItems: Record<string, Item | null> }) => {
  // Character should NOT rotate automatically, just be controllable with OrbitControls
  return (
    <group>
      {/* Base Character */}
      <group>
        {/* Head */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#8899FF" />
        </mesh>
        
        {/* Body */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1, 1.2, 0.6]} />
          <meshStandardMaterial color="#5566AA" />
        </mesh>
        
        {/* Arms */}
        <mesh position={[-0.6, 0.4, 0]}>
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshStandardMaterial color="#5566AA" />
        </mesh>
        <mesh position={[0.6, 0.4, 0]}>
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshStandardMaterial color="#5566AA" />
        </mesh>
        
        {/* Legs */}
        <mesh position={[-0.3, -0.5, 0]}>
          <boxGeometry args={[0.3, 0.8, 0.3]} />
          <meshStandardMaterial color="#5566AA" />
        </mesh>
        <mesh position={[0.3, -0.5, 0]}>
          <boxGeometry args={[0.3, 0.8, 0.3]} />
          <meshStandardMaterial color="#5566AA" />
        </mesh>
      </group>
      
      {/* Render equipped items */}
      {Object.entries(equippedItems).map(([type, item]) => {
        if (!item) return null;
        
        switch (type) {
          case "head":
            return (
              <mesh key={type} position={[0, 1.7, 0]}>
                <boxGeometry args={[0.9, 0.5, 0.9]} />
                <meshStandardMaterial color="#0044FF" />
              </mesh>
            );
          case "body":
            return (
              <mesh key={type} position={[0, 0.4, 0.2]}>
                <boxGeometry args={[1.2, 1.3, 0.4]} />
                <meshStandardMaterial color="#6633AA" />
              </mesh>
            );
          case "weapon":
            return (
              <mesh key={type} position={[-0.8, 0.3, 0.4]}>
                <boxGeometry args={[0.2, 1.4, 0.2]} />
                <meshStandardMaterial color="#FF2222" />
              </mesh>
            );
          case "shield":
            return (
              <mesh key={type} position={[0.8, 0.5, 0.4]}>
                <boxGeometry args={[0.1, 0.8, 0.8]} />
                <meshStandardMaterial color="#FFCC00" />
              </mesh>
            );
          case "feet":
            return (
              <group key={type}>
                <mesh position={[-0.3, -0.9, 0]}>
                  <boxGeometry args={[0.35, 0.2, 0.5]} />
                  <meshStandardMaterial color="#33AA55" />
                </mesh>
                <mesh position={[0.3, -0.9, 0]}>
                  <boxGeometry args={[0.35, 0.2, 0.5]} />
                  <meshStandardMaterial color="#33AA55" />
                </mesh>
              </group>
            );
          case "accessory":
            return (
              <mesh key={type} position={[0.5, 1.2, 0.5]}>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshStandardMaterial color="#AAAAAA" emissive="#555555" />
              </mesh>
            );
          default:
            return null;
        }
      })}
    </group>
  );
};

const Character = ({ characterId, equippedItems }: CharacterProps) => {
  const [character, setCharacter] = useState<CharacterType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCharacter = async () => {
      setLoading(true);
      const fetchedCharacter = await fetchCharacter(characterId);
      setCharacter(fetchedCharacter);
      setLoading(false);
    };

    loadCharacter();
  }, [characterId]);

  if (loading) {
    return <Skeleton className="w-full h-64 rounded-md" />;
  }

  if (!character) {
    return <div className="text-red-500">Failed to load character</div>;
  }

  return (
    <div className="pixel-border bg-pixel-white p-4 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">{character.name} - Level {character.level}</h2>
      
      <div className="relative w-full h-64">
        <Canvas
          camera={{ position: [0, 1, 5], fov: 50 }}
          style={{ background: '#111a2c' }}
        >
          {/* Enhanced lighting for character */}
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <spotLight
            position={[0, 5, 5]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={0.5}
            castShadow
          />
          
          <VoxelCharacter equippedItems={equippedItems} />
          
          <OrbitControls 
            enableZoom={true}
            maxPolarAngle={Math.PI / 2} 
            minPolarAngle={Math.PI / 4}
            enablePan={false}
          />
          <gridHelper args={[10, 10, `#444444`, `#222222`]} />
        </Canvas>
      </div>
    </div>
  );
};

export default Character;
