
import { Button } from "@/components/ui/button";
import { Item } from "@/services/apiService";
import { useAccount } from "wagmi";
import { Wallet } from "lucide-react";
import { useContract } from "@/context/ContractContext";

interface ItemDetailsProps {
  item: Item | null;
  isEquipped: boolean;
  onEquip: (item: Item) => void;
  onUnequip: (item: Item) => void;
  onConnect: () => void;
  itemOwnership: Record<number, boolean>;
}

const ItemDetails = ({ 
  item, 
  isEquipped, 
  onEquip, 
  onUnequip, 
  onConnect,
  itemOwnership
}: ItemDetailsProps) => {
  const { isConnected } = useAccount();

  if (!item) {
    return (
      <div className="p-4 bg-gradient-to-b from-blue-800 to-blue-900 rounded-sm">
        <h3 className="text-xl font-bold text-white mb-2">Select an Item</h3>
        <p className="text-blue-200">Click on an item to view its details</p>
      </div>
    );
  }

  // Determine button state
  const renderActionButton = () => {
    // Not connected - show connect button
    if (!isConnected) {
      return (
        <button 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 text-lg rounded-sm flex items-center justify-center"
          onClick={onConnect}
        >
          <Wallet className="mr-2" size={20} /> CONNECT WALLET TO USE
        </button>
      );
    }
    
    // Connected but doesn't own the item
    if (!itemOwnership[item.id]) {
      return (
        <button 
          className="w-full bg-gray-600 text-white font-bold py-3 text-lg rounded-sm cursor-not-allowed"
          disabled
        >
          YOU DON'T OWN THIS ITEM
        </button>
      );
    }
    
    // Connected and owns the item - show equip/unequip
    if (isEquipped) {
      return (
        <button 
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 text-lg rounded-sm"
          onClick={() => onUnequip(item)}
        >
          UNEQUIP
        </button>
      );
    } else {
      return (
        <button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-lg rounded-sm"
          onClick={() => onEquip(item)}
        >
          EQUIP
        </button>
      );
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-800 to-blue-900 rounded-sm p-4">
      <h3 className="text-xl font-bold text-white capitalize mb-1">{item.name}</h3>
      <p className="text-blue-300 capitalize mb-4">{item.type}</p>
      
      <p className="text-white mb-4">{item.description}</p>
      
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-white">Stats:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {item.stats.attack && (
            <div className="text-white">Attack: <span className="font-semibold text-red-400">+{item.stats.attack}</span></div>
          )}
          {item.stats.defense && (
            <div className="text-white">Defense: <span className="font-semibold text-blue-400">+{item.stats.defense}</span></div>
          )}
          {item.stats.magic && (
            <div className="text-white">Magic: <span className="font-semibold text-purple-400">+{item.stats.magic}</span></div>
          )}
          {item.stats.speed && (
            <div className="text-white">Speed: <span className="font-semibold text-green-400">+{item.stats.speed}</span></div>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        {renderActionButton()}
      </div>
    </div>
  );
};

export default ItemDetails;
