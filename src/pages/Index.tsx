
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Item, equipItem, unequipItem, fetchCharacter } from "@/services/apiService";
import Character from "@/components/Character";
import ItemGrid from "@/components/ItemGrid";
import ItemDetails from "@/components/ItemDetails";

const Index = () => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [equippedItems, setEquippedItems] = useState<Record<string, number | null>>({});

  const characterId = 1; // Hardcoded for simplicity

  // Load character data on initial render
  useEffect(() => {
    const loadCharacter = async () => {
      const fetchedCharacter = await fetchCharacter(characterId);
      if (fetchedCharacter && fetchedCharacter.equippedItems) {
        setEquippedItems(fetchedCharacter.equippedItems);
      }
    };

    loadCharacter();
  }, [characterId]);

  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
  };

  const handleEquipItem = async (item: Item) => {
    const success = await equipItem(characterId, item.type, item.id);
    if (success) {
      // Update local state immediately
      setEquippedItems(prev => ({
        ...prev,
        [item.type]: item.id
      }));
      toast.success(`${item.name} equipped successfully!`);
    }
  };

  const handleUnequipItem = async (item: Item) => {
    const success = await unequipItem(characterId, item.type);
    if (success) {
      // Update local state immediately
      setEquippedItems(prev => ({
        ...prev,
        [item.type]: null
      }));
      toast.success(`${item.name} removed.`);
    }
  };

  const isItemEquipped = (item: Item | null) => {
    if (!item) return false;
    return equippedItems[item.type] === item.id;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 to-blue-900 py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-center">
          <h1 className="text-4xl font-bold text-white">Item Selector</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <ItemGrid 
              onSelectItem={handleSelectItem} 
              selectedItemId={selectedItem?.id || null} 
            />
            
            {selectedItem && (
              <ItemDetails 
                item={selectedItem}
                isEquipped={isItemEquipped(selectedItem)}
                onEquip={handleEquipItem}
                onUnequip={handleUnequipItem}
              />
            )}
          </div>
          
          <div className="md:col-span-1 from-blue-800 to-blue-900 rounded-sm min-h-[600px] p-4">
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
