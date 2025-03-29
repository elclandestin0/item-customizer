
import { useState, useEffect, useRef } from "react";
import { Item, fetchItems } from "@/services/apiService";
import { Skeleton } from "@/components/ui/skeleton";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface ItemGridProps {
  onSelectItem: (item: Item) => void;
  selectedItemId: number | null;
}

// VoxelItem component for rendering a single item in 3D
const VoxelItem = ({ type }: { type: string }) => {
  const itemRef = useRef<THREE.Group>(null);
  
  // Add rotation animation
  useFrame((state, delta) => {
    if (itemRef.current) {
      itemRef.current.rotation.y += delta * 1; // Rotate continuously
    }
  });

  // Set up different geometries based on item type
  const getItemMesh = () => {
    switch (type) {
      case "head":
        return (
          <mesh>
            <boxGeometry args={[0.8, 0.5, 0.8]} />
            <meshStandardMaterial color="#0044FF" />
          </mesh>
        );
      case "body":
        return (
          <mesh>
            <boxGeometry args={[1, 1.2, 0.4]} />
            <meshStandardMaterial color="#6633AA" />
          </mesh>
        );
      case "weapon":
        return (
          <group>
            <mesh position={[0, 0.6, 0]}>
              <boxGeometry args={[0.2, 0.8, 0.2]} />
              <meshStandardMaterial color="#FF2222" />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.5, 0.2, 0.1]} />
              <meshStandardMaterial color="#AA2222" />
            </mesh>
          </group>
        );
      case "shield":
        return (
          <mesh>
            <boxGeometry args={[0.1, 0.8, 0.8]} />
            <meshStandardMaterial color="#FFCC00" />
          </mesh>
        );
      case "feet":
        return (
          <group>
            <mesh position={[-0.25, 0, 0]}>
              <boxGeometry args={[0.3, 0.2, 0.5]} />
              <meshStandardMaterial color="#33AA55" />
            </mesh>
            <mesh position={[0.25, 0, 0]}>
              <boxGeometry args={[0.3, 0.2, 0.5]} />
              <meshStandardMaterial color="#33AA55" />
            </mesh>
          </group>
        );
      case "accessory":
        return (
          <mesh>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshStandardMaterial color="#AAAAAA" emissive="#333333" />
          </mesh>
        );
      default:
        return (
          <mesh>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#FFFFFF" />
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="h-24 w-full rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className={`item-cell ${selectedItemId === item.id ? "selected" : ""}`}
          onClick={() => onSelectItem(item)}
        >
          <div className="w-full h-full">
            <Canvas 
              camera={{ position: [0, 0, 3], fov: 40 }}
              style={{ background: selectedItemId === item.id ? '#563b6a' : '#222738' }}
            >
              {/* Enhanced lighting */}
              <ambientLight intensity={0.5} />
              <pointLight position={[5, 5, 5]} intensity={1} />
              <pointLight position={[-5, -5, -5]} intensity={0.5} />
              <spotLight
                position={[0, 5, 5]}
                angle={0.3}
                penumbra={1}
                intensity={1}
                castShadow
              />
              
              <VoxelItem type={item.type} />
              <OrbitControls 
                enableZoom={false}
                enablePan={false}
                enableRotate={false}
              />
            </Canvas>
          </div>
          <div className="absolute -bottom-1 -right-1 text-xs font-bold bg-pixel-black text-white px-1 rounded-sm">
            {item.type.slice(0, 1).toUpperCase()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemGrid;
