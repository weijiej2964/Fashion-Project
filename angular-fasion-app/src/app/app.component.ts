import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

import { ModalPopupComponent } from './modal-popup/modal-popup.component';
import { HttpClientModule } from '@angular/common/http'; // Ensure this is here if needed at root
import { ApiService } from './api.service';
import { InventoryItem, InventoryByCategory } from './inventory.interface';
import { MatButtonModule } from '@angular/material/button';
import { switchMap } from 'rxjs/operators'; // Import switchMap

import { BrowserModule } from '@angular/platform-browser'; // Usually in app.module or main.ts
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeletePopupComponent } from './delete-popup/delete-popup.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'fashion-project';
  user: User | null = null;
  isSignUp: boolean = false;

  categories: string[] = ['Top', 'Bottom', 'Outerwear', 'Accessory', 'Shoes'];

  selectedCategory: string = 'top'; //default category
  inventoryByCategory: { [key: string]: any[] } = {};
  filteredInventory: InventoryItem[] = [];
  isLoading = true; // Initial state might be loading
  isDropdownOpen: boolean = false;

  searchResults: InventoryItem[] = [];
  selectedTag: string = '';
  tags: string[] = [];
  tag: string = '';
  showUserInfo: boolean = false;


  constructor(private authService: AuthService, public dialog: MatDialog, private apiService: ApiService) { };

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      this.user = user;
      if (user) {
        this.loadHomeData(); // Load data if user is already logged in on init
      } else {
        this.isLoading = false; // Stop loading if no user
      }
    });
  }

  switchToLogin() {
    this.isSignUp = false;
  }

  switchToSignup() {
    this.isSignUp = true;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleUserInfo() {
    this.showUserInfo = !this.showUserInfo;
  }

  // Function to open the modal
  openModal(): void {
    const dialogRef = this.dialog.open(ModalPopupComponent, {
      width: '400px',
      panelClass: 'custom-dialog'
    });

    // Subscribe to the dialog's afterClosed observable
    dialogRef.afterClosed().subscribe(result => {
      console.log('The add item dialog was closed. Result:', result);

      // If the modal closed with a 'true' result, it means an item was successfully added
      if (result === true) {
        console.log('Item successfully added. Reloading inventory...');
        // Reload the inventory data from the database and then filter/display it
        this.loadHomeData();
      } else {
        console.log('Add item modal closed without success (cancelled or error).');
      }
    });
  }


  onRegister(email: string, password: string, event: Event) {
    event.preventDefault();
    console.log("Email:", email, "Length:", email.length);
    console.log("Email Type:", typeof email);

    this.authService.register(email, password).subscribe({
      next: (user) => console.log('User is Registered:', user),
      error: (err) => console.log('Registration Failed:', err)
    });
  }

  onLogin(email: string, password: string, event: Event) {
    event.preventDefault();
    console.log('Login button clicked with:', email, password);
    // event.preventDefault(); // Duplicated
    console.log('Login button clicked:', email, password); // Duplicated

    this.authService.login(email, password).subscribe({
      next: (user) => {
        console.log('User logged in:', user);
        this.loadHomeData();
      },
      error: (err) => console.error('Login failed:', err)
    });
  }

  onGoogleSignIn(event: Event) {
    event.preventDefault();
    this.authService.googleSignIn().subscribe({
      next: (user) => {
        console.log('Google Sign-In successful, user:', user);
        this.loadHomeData();
      },
      error: (err) => {
        console.error('Google Sign-In error:', err);
      }
    });

  }

  loadHomeData() {
    this.isLoading = true; // Show loading indicator
    // Ensure user is available before attempting to load inventory
    if (this.user?.uid) {
      this.apiService.getInventory(this.user.uid).subscribe({
        next: (data) => {
          this.inventoryByCategory = this.transformInventoryData(data);
          console.log('transformed inventory:', this.inventoryByCategory);
          this.filterInventory(); // Filter after loading new data
          console.log('filtered inventory:', this.filteredInventory);
          this.isLoading = false; // Hide loading indicator
        },
        error: (err) => {
          console.error('Error loading inventory:', err);
          this.isLoading = false; // Hide loading indicator on error
        }
      });
    } else {
      console.warn("User not logged in, cannot load inventory.");
      this.inventoryByCategory = {}; // Clear inventory
      this.filteredInventory = [];
      this.isLoading = false; // Stop loading
    }


  }

  onLogout() {
    this.authService.logout().subscribe(() => {
      console.log('User Logged out');
      this.user = null; // Clear user state
      this.inventoryByCategory = {}; // Clear inventory
      this.filteredInventory = [];
      this.selectedCategory = 'top'; // Reset state
      this.selectedTag = '';
      this.tags = [];
      this.showUserInfo = false;
      this.isLoading = false; // Ensure loading is off after logout
    });
  }
  private transformInventoryData(rawData: any): InventoryByCategory {
    const result: InventoryByCategory = {};

    for (const category in rawData) {
      if (rawData.hasOwnProperty(category)) {
        // Ensure category exists in your categories list if needed, or handle dynamically
        if (!this.categories.includes(category)) {
          // Optional: Add new categories found in data to your categories list
          // this.categories.push(category);
          console.warn(`Category "${category}" found in DB but not in local categories list.`);
        }

        result[category] = [];

        const items = rawData[category];
        for (const itemId in items) {
          if (items.hasOwnProperty(itemId)) {
            // Cast or ensure the item structure matches InventoryItem
            const item: InventoryItem = {
              id: itemId, // Use the key from the DB as the item ID
              ...items[itemId]
            };
            result[category].push(item);
          }
        }
      }
    }
    return result;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterInventory();
    this.selectedTag = ''; // Reset selected tag when category changes
    this.tags = []; // Reset tags when category changes
  }

  filterInventory() {
    this.filteredInventory = this.inventoryByCategory[this.selectedCategory] || [];
    this.filterInventoryByTags();
  }

  ///////////Search bar functionality////////////
  /// This function filters the inventory based on the search term entered by the user.
  // selectTag(tag: string) { // This seems less used now with the tags array logic
  //   this.selectedTag = tag;
  //   this.filterInventoryByTag(); // Call filtering based on THIS tag
  // }}

  filterInventoryByTags() {
    // Start with the inventory for the selected category
    let inventoryToFilter = this.inventoryByCategory[this.selectedCategory] || [];

    // Filter the inventory based on the selected tags
    if (this.tags.length > 0) {
      this.filteredInventory = inventoryToFilter.filter(item => {
        // An item is included only if ALL selected tags are present in its tags array
        return this.tags.every(tag => item.tags && Array.isArray(item.tags) && item.tags.includes(tag));
      });
    } else {
      // If no tags are selected, show all items for the category
      this.filteredInventory = inventoryToFilter;
    }
    console.log('Filtered inventory by tags:', this.filteredInventory);
  }

  addTag(tag: string) {
    const tagToAdd = tag.trim();
    // Add the selected tag to the tags array if it doesnt already exist and is not empty
    if (tagToAdd && !this.tags.includes(tagToAdd)) {
      this.tags.push(tagToAdd);
      this.filterInventoryByTags(); // Filter inventory based on the new tag
    }
    this.selectedTag = ''; // Clear the input/selection
  }

  clearTags() {
    // Clear the tags array and reset the selected tag
    this.tags = [];
    this.selectedTag = '';
    this.filterInventoryByTags(); // Reset inventory display
  }
  deleteTag(tagToRemove: string) {
    // Remove the clicked tag from the tags array
    this.tags = this.tags.filter(tag => tag !== tagToRemove);
    this.filterInventoryByTags(); // Re-filter after removing a tag
  }


  // delete
  openDialog(item: InventoryItem): void {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '300px',
      data: { message: `Are you sure you want to delete ${item.item_name}?` },
      panelClass: 'confirm-deletion-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Confirmed: Delete item', item);
        this.deleteItem(item);
      } else {
        console.log('Deletion cancelled');
      }
    });
  }

  deleteItem(itemToDelete: InventoryItem): void {
    if (this.selectedCategory && this.inventoryByCategory[this.selectedCategory]) {
      this.inventoryByCategory[this.selectedCategory] = (this.inventoryByCategory[this.selectedCategory] || []).filter(
        item => item.id !== itemToDelete.id
      );
      this.filterInventoryByTags();

      console.log(`Item "${itemToDelete.item_name}" removed from frontend view.`);

      if (this.user?.uid && itemToDelete.id) {
        this.apiService.deleteInventory(this.user.uid, this.selectedCategory, itemToDelete.id).subscribe({
          next: (res) => {
            console.log(`"${itemToDelete.item_name}" was successfully deleted from DB!`);
          },
          error: (err) => {
            console.error(`Failed to delete item from DB:`, err);
            console.log('DB deletion failed, attempting to resync inventory...');
            this.loadHomeData();
          }
        });
      } else {
        console.error("User ID or Item ID not found — cannot delete item from DB.");
        // Handle error: If the DB deletion wasn't attempted, potentially revert frontend deletion
        console.log('DB deletion not attempted, attempting to resync inventory...');
        this.loadHomeData(); // Reload data to revert the optimistic deletion
      }
    } else {
      console.warn("Cannot delete item: Selected category or inventory data missing.");
    }
  }

  getItemImage(inventoryItem: { image_blob?: string }): HTMLImageElement | null {
    if (!inventoryItem.image_blob) {
      console.error('No image blob found in inventory item.');
      return null; // Return null if image_blob is missing
    }

    try {
      const blob = new Blob([inventoryItem.image_blob], { type: 'image/png' });
      const blobURL = URL.createObjectURL(blob);

      const img = document.createElement('img');
      img.src = blobURL;
      img.alt = 'Inventory Item Image';
      img.style.width = '300px'; // Example: adjust size
      img.style.height = 'auto';

      // Optional: Revoke the Blob URL later to free up resources
      setTimeout(() => URL.revokeObjectURL(blobURL), 10000);

      return img;
    } catch (error) {
      console.error('Error creating image from blob:', error);
      return null;
    }
  }


}



