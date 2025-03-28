
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Item } from "@/services/apiService";
import { Skeleton } from "@/components/ui/skeleton";

interface ItemDetailsProps {
  item: Item | null;
  isEquipped: boolean;
  onEquip: (item: Item) => void;
  onUnequip: (item: Item) => void;
}

const ItemDetails = ({ item, isEquipped, onEquip, onUnequip }: ItemDetailsProps) => {
  if (!item) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Select an Item</CardTitle>
          <CardDescription>Click on an item to view its details</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="capitalize">{item.name}</CardTitle>
        <CardDescription className="capitalize">{item.type}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{item.description}</p>
        
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Stats:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {item.stats.attack && (
              <div>Attack: <span className="font-semibold text-pixel-red">+{item.stats.attack}</span></div>
            )}
            {item.stats.defense && (
              <div>Defense: <span className="font-semibold text-pixel-blue">+{item.stats.defense}</span></div>
            )}
            {item.stats.magic && (
              <div>Magic: <span className="font-semibold text-pixel-purple">+{item.stats.magic}</span></div>
            )}
            {item.stats.speed && (
              <div>Speed: <span className="font-semibold text-pixel-green">+{item.stats.speed}</span></div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {isEquipped ? (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => onUnequip(item)}
          >
            Unequip
          </Button>
        ) : (
          <Button 
            className="w-full pixel-btn" 
            onClick={() => onEquip(item)}
          >
            Equip
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ItemDetails;
