
import { useState, useEffect } from "react";
import { Item, fetchItems } from "@/services/apiService";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ItemGridProps {
  onSelectItem: (item: Item) => void;
  selectedItemId: number | null;
}

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
          <Skeleton key={index} className="item-cell" />
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
          <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
            {/* We'll replace these with actual pixel art images */}
            <div className={`w-full h-full bg-pixel-${getColorByType(item.type)} rounded-sm transform scale-90 animate-pulse-slow`}></div>
          </div>
          <div className="absolute -bottom-1 -right-1 text-xs font-bold bg-pixel-black text-white px-1 rounded-sm">
            {item.type.slice(0, 1).toUpperCase()}
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper function to assign colors based on item type
const getColorByType = (type: string): string => {
  switch (type) {
    case "head":
      return "blue";
    case "body":
      return "purple";
    case "weapon":
      return "red";
    case "shield":
      return "yellow";
    case "feet":
      return "green";
    case "accessory":
      return "gray";
    default:
      return "white";
  }
};

export default ItemGrid;
