
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Item, equipItem, unequipItem, fetchCharacter } from "@/services/apiService";
import Character from "@/components/Character";
import ItemGrid from "@/components/ItemGrid";
import ItemDetails from "@/components/ItemDetails";
import AuthButton from "@/components/AuthButton";
import { useAccount, useConnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { useContract } from "@/context/ContractContext";

const Index = () => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [equippedItems, setEquippedItems] = useState<Record<string, number | null>>({});
  const [itemOwnership, setItemOwnership] = useState<Record<number, boolean>>({});
  
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { contract } = useContract();

  const characterId = 1; // Hardcoded for simplicity

  // Load character data on initial render or when address changes
  useEffect(() => {
    const loadCharacter = async () => {
      if (isConnected && address) {
        const fetchedCharacter = await fetchCharacter(characterId);
        if (fetchedCharacter && fetchedCharacter.equippedItems) {
          setEquippedItems(fetchedCharacter.equippedItems);
        }
      } else {
        // Reset equipped items when disconnected
        setEquippedItems({});
      }
    };

    loadCharacter();
  }, [characterId, isConnected, address]);

  // Check ownership for items when connected
  useEffect(() => {
    const checkOwnership = async () => {
      if (!contract || !address || !isConnected) {
        setItemOwnership({}); // Reset ownership when not connected
        return;
      }

      try {
        // Get all items from ItemGrid component (assuming this data is fetched there)
        const itemsResponse = await fetch("http://localhost:4000/api/items");
        const items = await itemsResponse.json();

        const ownershipPromises = items.map(async (item: Item) => {
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
      } catch (error) {
        console.error("Error checking item ownership:", error);
        toast.error("Failed to check item ownership");
      }
    };

    checkOwnership();
  }, [contract, address, isConnected]);

  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
  };

  const handleEquipItem = async (item: Item) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!itemOwnership[item.id]) {
      toast.error("You don't own this item");
      return;
    }

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
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

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

  const handleConnect = () => {
    connect({ connector: new MetaMaskConnector() });
  };

  const isItemEquipped = (item: Item | null) => {
    if (!item) return false;
    return equippedItems[item.type] === item.id;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 to-blue-900 py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">Item Selector</h1>
          <AuthButton />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <ItemGrid 
              onSelectItem={handleSelectItem} 
              selectedItemId={selectedItem?.id || null}
              itemOwnership={itemOwnership}
              isConnected={isConnected} 
            />
            
            <ItemDetails 
              item={selectedItem}
              isEquipped={isItemEquipped(selectedItem)}
              onEquip={handleEquipItem}
              onUnequip={handleUnequipItem}
              onConnect={handleConnect}
              itemOwnership={itemOwnership}
            />
          </div>
          
          <div className="md:col-span-1 from-blue-800 to-blue-900 rounded-sm min-h-[600px] p-4">
            <Character 
              characterId={characterId} 
              equippedItems={equippedItems}
              isConnected={isConnected}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
