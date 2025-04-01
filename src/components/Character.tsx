import { useState, useEffect } from "react";
import { Character as CharacterType, fetchCharacter } from "@/services/apiService";
import { Skeleton } from "@/components/ui/skeleton";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Lock } from "lucide-react";

interface CharacterProps {
  characterId: number;
  equippedItems: Record<string, number | null>;
  isConnected: boolean;
}

// VoxelCharacter component to render the 3D character and its equipment
const VoxelCharacter = ({ equippedItems, isConnected }: { 
  equippedItems: Record<string, number | null>;
  isConnected: boolean;
}) => {
  return (
    <group>
      <group>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#8899FF" />
        </mesh>
        
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1, 1.2, 0.6]} />
          <meshStandardMaterial color="#5566AA" />
        </mesh>
        
        <mesh position={[-0.6, 0.4, 0]}>
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshStandardMaterial color="#5566AA" />
        </mesh>
        <mesh position={[0.6, 0.4, 0]}>
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshStandardMaterial color="#5566AA" />
        </mesh>
        
        <mesh position={[-0.3, -0.5, 0]}>
          <boxGeometry args={[0.3, 0.8, 0.3]} />
          <meshStandardMaterial color="#5566AA" />
        </mesh>
        <mesh position={[0.3, -0.5, 0]}>
          <boxGeometry args={[0.3, 0.8, 0.3]} />
          <meshStandardMaterial color="#5566AA" />
        </mesh>
      </group>
      
      {isConnected && Object.entries(equippedItems).map(([type, item]) => {
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

const Character = ({ characterId, equippedItems, isConnected }: CharacterProps) => {
  const [character, setCharacter] = useState<CharacterType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCharacter = async () => {
      setLoading(true);
      if (isConnected) {
        const fetchedCharacter = await fetchCharacter(characterId);
        setCharacter(fetchedCharacter);
      } else {
        setCharacter({
          id: characterId,
          name: "Guest",
          level: 1,
          equippedItems: {}
        });
      }
      setLoading(false);
    };

    loadCharacter();
  }, [characterId, isConnected]);

  if (loading) {
    return <Skeleton className="w-full h-64 rounded-none" />;
  }

  if (!character) {
    return <div className="text-red-500">Failed to load character</div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-2">
        {character.name} {isConnected ? `- Level ${character.level}` : ""}
        {!isConnected && <span className="text-sm ml-2 font-normal text-blue-300">(Not Connected)</span>}
      </h2>
      
      <div className="relative flex-grow">
        {!isConnected && (
          <div className="absolute top-2 right-2 z-10 bg-black bg-opacity-60 rounded-full p-2">
            <Lock size={20} className="text-white" />
          </div>
        )}
        
        <Canvas
          camera={{ position: [0, 1, 5], fov: 50 }}
          className="!bg-transparent"
        >
          <ambientLight intensity={0.7} />
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
          
          <VoxelCharacter equippedItems={equippedItems} isConnected={isConnected} />
          
          <OrbitControls 
            enableZoom={true}
            maxPolarAngle={Math.PI / 2} 
            minPolarAngle={Math.PI / 4}
            enablePan={false}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default Character;
