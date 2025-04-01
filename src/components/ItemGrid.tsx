import { useState, useEffect, useRef } from "react";
import { Item, fetchItems } from "@/services/apiService";
import { Skeleton } from "@/components/ui/skeleton";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Lock } from "lucide-react";

interface ItemGridProps {
  onSelectItem: (item: Item) => void;
  selectedItemId: number | null;
  itemOwnership: Record<number, boolean>;
  isConnected: boolean;
}

// VoxelItem component for rendering a single item in 3D
const VoxelItem = ({ type, isOwned, isConnected }: { type: string; isOwned: boolean; isConnected: boolean }) => {
  const itemRef = useRef<THREE.Group>(null);
  
  // Add rotation animation
  useFrame((state, delta) => {
    if (itemRef.current) {
      itemRef.current.rotation.y += delta * 1; // Rotate continuously
    }
  });

  // Set up different geometries based on item type
  const getItemMesh = () => {
    // Determine material properties based on connection and ownership
    const materialProps = isConnected 
      ? (isOwned ? { color: "#FFFFFF" } : { color: "#888888", transparent: true, opacity: 0.6 })
      : { color: "#AAAAAA", transparent: true, opacity: 0.8 };  // Not connected, show as semi-locked

    switch (type) {
      case "head":
        return (
          <mesh>
            <boxGeometry args={[0.8, 0.5, 0.8]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        );
      case "body":
        return (
          <mesh>
            <boxGeometry args={[1, 1.2, 0.4]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        );
      case "weapon":
        return (
          <group>
            <mesh position={[0, 0.6, 0]}>
              <boxGeometry args={[0.2, 0.8, 0.2]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.5, 0.2, 0.1]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
          </group>
        );
      case "shield":
        return (
          <mesh>
            <boxGeometry args={[0.1, 0.8, 0.8]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        );
      case "feet":
        return (
          <group>
            <mesh position={[-0.25, 0, 0]}>
              <boxGeometry args={[0.3, 0.2, 0.5]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
            <mesh position={[0.25, 0, 0]}>
              <boxGeometry args={[0.3, 0.2, 0.5]} />
              <meshStandardMaterial {...materialProps} />
            </mesh>
          </group>
        );
      case "accessory":
        return (
          <mesh>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshStandardMaterial {...materialProps} emissive={isOwned ? "#333333" : "#111111"} />
          </mesh>
        );
      default:
        return (
          <mesh>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        );
    }
  };

  return (
    <group ref={itemRef}>
      {getItemMesh()}
    </group>
  );
};

const ItemGrid = ({ onSelectItem, selectedItemId, itemOwnership, isConnected }: ItemGridProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      const fetchedItems = await fetchItems();
      setItems(fetchedItems);
      setLoading(false);
    };

    loadItems();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {[...Array(12)].map((_, index) => (
          <Skeleton key={index} className="h-24 aspect-square rounded-none" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={`fortnite-item-cell relative ${selectedItemId === item.id ? "selected" : ""} 
            ${isConnected && !itemOwnership[item.id] ? "opacity-70" : ""}`}
          onClick={() => onSelectItem(item)}
        >
          <div className="w-full h-full relative">
            <Canvas 
              camera={{ position: [0, 0, 3], fov: 40 }}
              className="!bg-transparent"
            >
              {/* Enhanced lighting */}
              <ambientLight intensity={0.7} />
              <pointLight position={[5, 5, 5]} intensity={1} />
              <pointLight position={[-5, -5, -5]} intensity={0.5} />
              <spotLight
                position={[0, 5, 5]}
                angle={0.3}
                penumbra={1}
                intensity={1}
                castShadow
              />
              
              <VoxelItem 
                type={item.type} 
                isOwned={isConnected && (itemOwnership[item.id] || false)} 
                isConnected={isConnected} 
              />
              <OrbitControls 
                enableZoom={false}
                enablePan={false}
                enableRotate={false}
              />
            </Canvas>
            
            <div className="absolute bottom-0 left-0 right-0 bg-[#7e22ce] h-6">
              <p className="text-xs text-white font-bold truncate px-1">{item.name}</p>
            </div>
            
            {/* Show lock icon for items the user doesn't own when connected */}
            {isConnected && !itemOwnership[item.id] && (
              <div className="absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-1">
                <Lock size={12} className="text-white" />
              </div>
            )}
            
            {/* Show lock icon for all items when not connected */}
            {!isConnected && (
              <div className="absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-1">
                <Lock size={12} className="text-white" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemGrid;
