// inventory.interface.ts
export interface InventoryItem {
    id: string;        // The Firebase key
    image_blob?: string;
    image_url: string;
    item_desc: string;
    item_name: string;
    tags: string[];
}

export interface InventoryByCategory {
    [category: string]: InventoryItem[];
}