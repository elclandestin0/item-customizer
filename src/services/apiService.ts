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
  equippedItems: Record<string, Item>
}

// API endpoints would be defined here
const API_BASE_URL = "http://localhost:4000/api";

// Function to fetch all available items
export const fetchItems = async (): Promise<Item[]> => {
  try {
    // This would be a real API call in production
    const response = await fetch(`${API_BASE_URL}/items`);
    if (!response.ok) throw new Error('Failed to fetch items');
    return await response.json();

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
    
  } catch (error) {
    console.error("Error unequipping item:", error);
    toast.error("Failed to unequip item. Please try again.");
    return false;
  }
};
