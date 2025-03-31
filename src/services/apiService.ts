import { toast } from "sonner";

export interface Item {
  id: number;
  name: string;
  type: string;
  description: string;
  stats: {
    defense?: number;
    attack?: number;
    magic?: number;
    speed?: number;
  };
  imageUrl: string;
}

export interface Character {
  id: number;
  name: string;
  level: number;
  equippedItems: {
    head?: number;
    body?: number;
    weapon?: number;
    shield?: number;
    feet?: number;
    accessory?: number;
  };
}

// Mock data for development (will be replaced with API calls)
const mockItems: Item[] = [
  {
    id: 1,
    name: "Wizard Hat",
    type: "head",
    description: "A pointy hat that increases magic power.",
    stats: { magic: 5 },
    imageUrl: "/items/wizard-hat.png"
  },
  {
    id: 2,
    name: "Knight Armor",
    type: "body",
    description: "Heavy armor with good protection.",
    stats: { defense: 10 },
    imageUrl: "/items/knight-armor.png"
  },
  {
    id: 3,
    name: "Fire Sword",
    type: "weapon",
    description: "A sword imbued with fire magic.",
    stats: { attack: 8, magic: 3 },
    imageUrl: "/items/fire-sword.png"
  },
  {
    id: 4,
    name: "Wooden Shield",
    type: "shield",
    description: "A basic shield that provides moderate protection.",
    stats: { defense: 5 },
    imageUrl: "/items/wooden-shield.png"
  },
  {
    id: 5,
    name: "Leather Boots",
    type: "feet",
    description: "Light boots that allow for quick movement.",
    stats: { speed: 3 },
    imageUrl: "/items/leather-boots.png"
  },
  {
    id: 6,
    name: "Magic Amulet",
    type: "accessory",
    description: "An ancient amulet that enhances magical abilities.",
    stats: { magic: 7 },
    imageUrl: "/items/magic-amulet.png"
  }
];

const mockCharacter: Character = {
  id: 1,
  name: "Hero",
  level: 10,
  equippedItems: {}
};

// API endpoints would be defined here
const API_BASE_URL = "http://localhost:4000/api";

// Function to fetch all available items
export const fetchItems = async (): Promise<Item[]> => {
  try {
    // This would be a real API call in production
    const response = await fetch(`${API_BASE_URL}/items`);
    if (!response.ok) throw new Error('Failed to fetch items');
    return await response.json();
    
    // Using mock data for now
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockItems), 300);
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    toast.error("Failed to load items. Please try again.");
    return [];
  }
};

// Function to fetch character data
export const fetchCharacter = async (characterId: number): Promise<Character | null> => {
  try {
    // This would be a real API call in production
    const response = await fetch(`${API_BASE_URL}/character/${characterId}`);
    if (!response.ok) throw new Error('Failed to fetch character');
    return await response.json();
    
    // Using mock data for now
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockCharacter), 300);
    });
  } catch (error) {
    console.error("Error fetching character:", error);
    toast.error("Failed to load character data. Please try again.");
    return null;
  }
};

// Function to equip an item to the character
export const equipItem = async (characterId: number, itemType: string, itemId: number): Promise<boolean> => {
  try {
    // This would be a real API call in production
    const response = await fetch(`${API_BASE_URL}/character/${characterId}/equip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemType, itemId })
    });
    if (!response.ok) throw new Error('Failed to equip item');
    return true;
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        mockCharacter.equippedItems = {
          ...mockCharacter.equippedItems,
          [itemType]: itemId
        };
        resolve(true);
      }, 300);
    });
  } catch (error) {
    console.error("Error equipping item:", error);
    toast.error("Failed to equip item. Please try again.");
    return false;
  }
};

// Function to unequip an item from the character
export const unequipItem = async (characterId: number, itemType: string): Promise<boolean> => {
  try {
    // This would be a real API call in production
    const response = await fetch(`${API_BASE_URL}/character/${characterId}/unequip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemType })
    });
    if (!response.ok) throw new Error('Failed to unequip item');
    return true;
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedItems = { ...mockCharacter.equippedItems };
        delete updatedItems[itemType as keyof typeof updatedItems];
        mockCharacter.equippedItems = updatedItems;
        resolve(true);
      }, 300);
    });
  } catch (error) {
    console.error("Error unequipping item:", error);
    toast.error("Failed to unequip item. Please try again.");
    return false;
  }
};
