
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Item, equipItem, unequipItem } from "@/services/apiService";
import Character from "@/components/Character";
import ItemGrid from "@/components/ItemGrid";
import ItemDetails from "@/components/ItemDetails";

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
    <div className="min-h-screen py-8 px-4">
      <div className="pixel-container">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Pixel Gear Selector</h1>
          <p className="text-muted-foreground">Customize your character with unique gear</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-1">
            <Character 
              characterId={characterId} 
              equippedItems={equippedItems} 
            />
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="inventory" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="stats">Character Stats</TabsTrigger>
              </TabsList>
              
              <TabsContent value="inventory" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <ItemGrid 
                      onSelectItem={handleSelectItem} 
                      selectedItemId={selectedItem?.id || null} 
                    />
                  </div>
                  
                  <div className="md:col-span-1">
                    <ItemDetails 
                      item={selectedItem} 
                      isEquipped={isItemEquipped(selectedItem)}
                      onEquip={handleEquipItem}
                      onUnequip={handleUnequipItem}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="stats">
                <Card>
                  <CardHeader>
                    <CardTitle>Character Stats</CardTitle>
                    <CardDescription>Current attributes and abilities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold">Attack</h3>
                          <div className="h-2 bg-gray-700 rounded-full">
                            <div className="h-full bg-pixel-red rounded-full" style={{ width: "40%" }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold">Defense</h3>
                          <div className="h-2 bg-gray-700 rounded-full">
                            <div className="h-full bg-pixel-blue rounded-full" style={{ width: "60%" }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold">Magic</h3>
                          <div className="h-2 bg-gray-700 rounded-full">
                            <div className="h-full bg-pixel-purple rounded-full" style={{ width: "30%" }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold">Speed</h3>
                          <div className="h-2 bg-gray-700 rounded-full">
                            <div className="h-full bg-pixel-green rounded-full" style={{ width: "50%" }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <h3 className="text-sm font-semibold mb-2">Equipped Items</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(equippedItems).map(([type, item]) => (
                            <div key={type} className="flex items-center justify-between">
                              <span className="capitalize">{type}:</span>
                              <span className="font-medium">{item ? item.name : "None"}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
