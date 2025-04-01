import { useState, useEffect, useRef } from "react";
import { Item, fetchItems } from "@/services/apiService";
import { Skeleton } from "@/components/ui/skeleton";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useContract } from "@/context/ContractContext";

interface ItemGridProps {
  onSelectItem: (item: Item) => void;
  selectedItemId: number | null;
}

// VoxelItem component for rendering a single item in 3D
const VoxelItem = ({ type, isOwned }: { type: string; isOwned: boolean }) => {
  const itemRef = useRef<THREE.Group>(null);
  
  // Add rotation animation
  useFrame((state, delta) => {
    if (itemRef.current) {
      itemRef.current.rotation.y += delta * 1; // Rotate continuously
    }
  });

  // Set up different geometries based on item type
  const getItemMesh = () => {
    const materialProps = isOwned 
      ? { color: "#FFFFFF" }
      : { color: "#666666", transparent: true, opacity: 0.5 };

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

const ItemGrid = ({ onSelectItem, selectedItemId }: ItemGridProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemOwnership, setItemOwnership] = useState<Record<number, boolean>>({});
  const { contract } = useContract();
  const { address } = useAccount();

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      const fetchedItems = await fetchItems();
      setItems(fetchedItems);
      setLoading(false);
    };

    loadItems();
  }, []);

  // Check ownership for all items
  useEffect(() => {
    const checkOwnership = async () => {
      if (!contract || !address) return;

      const ownershipPromises = items.map(async (item) => {
        try {
          const balance = await contract.balanceOf(address, item.id);
          return { itemId: item.id, isOwned: balance > 0n };
        } catch (error) {
          console.error(`Error checking ownership for item ${item.id}:`, error);
          return { itemId: item.id, isOwned: false };
        }
      });

      const results = await Promise.all(ownershipPromises);
      const ownershipMap = results.reduce((acc, { itemId, isOwned }) => {
        acc[itemId] = isOwned;
        return acc;
      }, {} as Record<number, boolean>);

      setItemOwnership(ownershipMap);
    };

    checkOwnership();
  }, [contract, address, items]);

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
          className={`fortnite-item-cell ${selectedItemId === item.id ? "selected" : ""} 
            ${!itemOwnership[item.id] ? "opacity-50" : ""}`}
          onClick={() => itemOwnership[item.id] && onSelectItem(item)}
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
              
              <VoxelItem type={item.type} isOwned={itemOwnership[item.id] || false} />
              <OrbitControls 
                enableZoom={false}
                enablePan={false}
                enableRotate={false}
              />
            </Canvas>
            
            <div className="absolute bottom-0 left-0 right-0 bg-[#7e22ce] h-6">
              <p className="text-xs text-white font-bold truncate px-1">{item.name}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemGrid;
