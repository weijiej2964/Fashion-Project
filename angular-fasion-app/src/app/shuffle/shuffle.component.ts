import { Component } from '@angular/core';
import { InventoryItem, InventoryByCategory } from '../inventory.interface';

@Component({
  selector: 'app-shuffle',
  imports: [],
  templateUrl: './shuffle.component.html',
  styleUrl: './shuffle.component.css'
})
export class ShuffleComponent {
  inventoryByCategory: { [key: string]: any[] } = {};
  filteredInventory: InventoryItem[] = [];
  tags: string[] = []; //default tags

  shuffledOutfit: { [key: string]: any[] } = {}

  clearTags() {
    // Clear the tags array and reset the selected tag
    this.tags = [];
    // this.selectedTag = '';
    // this.filteredInventory = this.inventoryByCategory[this.selectedCategory]; // Reset inventory
  }
  deleteTag(tagToRemove: string) {
    // Remove the clicked tag from the tags array
    this.tags = this.tags.filter(tag => tag !== tagToRemove);
    // this.filterInventoryByTags();
  }

  addTag(tag: string) {
    // Add the selected tag to the tags array if it doesnt already exist
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      // this.filterInventoryByTags(); // Filter inventory based on the new tag
    }
    // this.selectedTag = '';
  }

  shuffle() {
    let outerwear = Math.random() * (this.inventoryByCategory["outerwear"].length - 1 - 0) + 0
    let top = Math.random() * (this.inventoryByCategory["top"].length - 1 - 0) + 0
    let bottom = Math.random() * (this.inventoryByCategory["bottom"].length - 1 - 0) + 0
    let shoes = Math.random() * (this.inventoryByCategory["shoes"].length - 1 - 0) + 0
    let accessory = Math.random() * (this.inventoryByCategory["accessory"].length - 1 - 0) + 0

    this.shuffledOutfit["outerwear"] = this.inventoryByCategory["outerwear"][outerwear]
    this.shuffledOutfit["top"] = this.inventoryByCategory["top"][top]
    this.shuffledOutfit["bottom"] = this.inventoryByCategory["bottom"][bottom]
    this.shuffledOutfit["shoes"] = this.inventoryByCategory["shoes"][shoes]
    this.shuffledOutfit["accessory"] = this.inventoryByCategory["accessory"][accessory]

  }




}
