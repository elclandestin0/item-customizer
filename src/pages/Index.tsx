
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Item, equipItem, unequipItem } from "@/services/apiService";
import Character from "@/components/Character";
import ItemGrid from "@/components/ItemGrid";
import ItemDetails from "@/components/ItemDetails";
import { Filter, SlidersHorizontal } from "lucide-react";

const Index = () => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [equippedItems, setEquippedItems] = useState<Record<string, Item | null>>({
    head: null,
    body: null,
    weapon: null,
    shield: null,
    feet: null,
    accessory: null
  });
  
  const characterId = 1; // Hardcoded for simplicity

  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
  };

  const handleEquipItem = async (item: Item) => {
    const success = await equipItem(characterId, item.type, item.id);
    if (success) {
      setEquippedItems(prev => ({
        ...prev,
        [item.type]: item
      }));
      toast.success(`${item.name} equipped successfully!`);
    }
  };

  const handleUnequipItem = async (item: Item) => {
    const success = await unequipItem(characterId, item.type);
    if (success) {
      setEquippedItems(prev => ({
        ...prev,
        [item.type]: null
      }));
      toast.success(`${item.name} removed.`);
    }
  };

  const isItemEquipped = (item: Item | null) => {
    if (!item) return false;
    return equippedItems[item.type]?.id === item.id;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-950 py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-center">
          <h1 className="text-4xl font-bold text-white mr-4">Outfit</h1>
          <div className="ml-auto flex gap-2">
            <button className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold py-1 px-4 rounded">
              SORT: SEASON
            </button>
            <button className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold py-1 px-4 rounded">
              FILTER: ALL
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <ItemGrid 
              onSelectItem={handleSelectItem} 
              selectedItemId={selectedItem?.id || null} 
            />
            
            <div className="flex justify-center">
              <button className="fortnite-button px-12">
                EQUIP
              </button>
            </div>
          </div>
          
          <div className="md:col-span-1 bg-gradient-to-b from-blue-800 to-blue-900 rounded-sm min-h-[600px] p-4">
            <Character 
              characterId={characterId} 
              equippedItems={equippedItems} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
