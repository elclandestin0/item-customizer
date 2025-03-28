
import { useEffect, useState } from "react";
import { Character as CharacterType, fetchCharacter, Item } from "@/services/apiService";
import { Skeleton } from "@/components/ui/skeleton";

interface CharacterProps {
  characterId: number;
  equippedItems: Record<string, Item | null>;
}

const Character = ({ characterId, equippedItems }: CharacterProps) => {
  const [character, setCharacter] = useState<CharacterType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCharacter = async () => {
      setLoading(true);
      const fetchedCharacter = await fetchCharacter(characterId);
      setCharacter(fetchedCharacter);
      setLoading(false);
    };

    loadCharacter();
  }, [characterId]);

  if (loading) {
    return <Skeleton className="w-full h-64 rounded-md" />;
  }

  if (!character) {
    return <div className="text-red-500">Failed to load character</div>;
  }

  return (
    <div className="pixel-border bg-pixel-white p-6 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">{character.name} - Level {character.level}</h2>
      
      <div className="relative w-40 h-64">
        {/* Character base */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-40 bg-pixel-blue rounded-sm"></div>
        
        {/* Render equipped items as colored blocks on top of character */}
        {Object.entries(equippedItems).map(([type, item]) => {
          if (!item) return null;
          
          let style: React.CSSProperties = {};
          
          switch (type) {
            case "head":
              style = { top: "10%", left: "50%", transform: "translateX(-50%)", width: "16px", height: "16px" };
              break;
            case "body":
              style = { top: "35%", left: "50%", transform: "translateX(-50%)", width: "32px", height: "32px" };
              break;
            case "weapon":
              style = { top: "40%", left: "15%", width: "8px", height: "24px" };
              break;
            case "shield":
              style = { top: "40%", right: "15%", width: "16px", height: "16px" };
              break;
            case "feet":
              style = { bottom: "15%", left: "50%", transform: "translateX(-50%)", width: "24px", height: "8px" };
              break;
            case "accessory":
              style = { top: "25%", right: "25%", width: "8px", height: "8px" };
              break;
          }
          
          return (
            <div 
              key={type}
              className={`absolute bg-pixel-${getColorByType(type)} rounded-sm`}
              style={style}
            ></div>
          );
        })}
      </div>
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

export default Character;
