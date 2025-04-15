import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { subscribeOn } from 'rxjs';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './api.service';
import { InventoryItem, InventoryByCategory } from './inventory.interface';
import { initializeApp } from "firebase/app";
import { switchMap } from 'rxjs/operators';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule

import { MatCardModule } from '@angular/material/card';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { DeletePopupComponent } from './delete-popup/delete-popup.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDialogModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'fashion-project';
  user: User | null = null;
  isSignUp: boolean = false; // Or true, depending on your initial state

  selectedCategory: string = 'top'; //default category
  inventoryByCategory: { [key: string]: any[] } = {};
  filteredInventory: InventoryItem[] = [];
  isLoading = true;
  isDropdownOpen: boolean = false;

  searchResults: InventoryItem[] = [];
  selectedTag: string = ''; //default selected tag
  tags: string[] = []; //default tags
  tag: string = ''; //default tag
  isLoading = true;
  

  constructor(private authService: AuthService, private apiService: ApiService, public dialog: MatDialog) { };

  ngOnInit() {
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

  onRegister(email: string, password: string, event: Event) {
    event.preventDefault() // prevent page refresh
    console.log("Email:", email, "Length:", email.length);
    console.log("Email Type:", typeof email);

    this.authService.register(email, password).subscribe({
      next: (user) => console.log('User is Registered:', user),
      error: (err) => console.log('Registeration Failed:', err)
    });
  }

  onLogin(email: string, password: string, event: Event) {
    event.preventDefault();
    console.log('Login button clicked:', email, password);

    this.authService.login(email, password).subscribe({
      next: (user) => {
        console.log('User logged in:', user);
        this.loadHomeData(); // <-- Now runs AFTER login succeeds
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
    this.authService.getUser().subscribe(user => {
      this.user = user;

      console.log(this.user);

      this.apiService.getInventory(this.user?.uid || '23642').subscribe(data => {
        this.inventoryByCategory = this.transformInventoryData(data);
        console.log('transformed inventory:', this.inventoryByCategory);
        this.filterInventory();
        console.log('filtered inventory:', this.filteredInventory);
      })


    });


  }

  onLogout() {
    this.authService.logout().subscribe(() => {
      console.log('User Logged out');
    });
  }

  private transformInventoryData(rawData: any): InventoryByCategory {
    const result: InventoryByCategory = {};

    for (const category in rawData) {
      if (rawData.hasOwnProperty(category)) {
        result[category] = [];

        const items = rawData[category];
        for (const itemId in items) {
          if (items.hasOwnProperty(itemId)) {
            result[category].push({
              id: itemId,
              ...items[itemId]
            })
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
    this.filteredInventory = this.inventoryByCategory[this.selectedCategory]; // Reset filtered inventory
  }

  filterInventory() {
    this.filteredInventory = this.inventoryByCategory[this.selectedCategory];
  }

///////////Search bar functionality////////////
/// This function filters the inventory based on the search term entered by the user.
  selectTag(tag: string) {
    this.selectedTag = tag;
    this.filterInventoryByTag();
  }

  filterInventoryByTag() {
    // If a tag is selected, filter the inventory by that tag. Otherwise, show all items in the selected category.
      if (this.selectedTag) {
      this.filteredInventory = this.inventoryByCategory[this.selectedCategory].filter(item => item.tags && item.tags.includes(this.selectedTag));
    } else {
      this.filteredInventory = this.inventoryByCategory[this.selectedCategory];
    }
  }

  filterInventoryByTags() {
    // Filter the inventory based on the selected tags
    if (this.tags.length > 0) {
      this.filteredInventory = this.inventoryByCategory[this.selectedCategory].filter(item => {
        return this.tags.every(tag => item.tags && item.tags.includes(tag));
      });
    } else {
      this.filteredInventory = this.inventoryByCategory[this.selectedCategory];
    }
  }

  addTag(tag: string) {
    // Add the selected tag to the tags array if it doesnt already exist
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.filterInventoryByTags(); // Filter inventory based on the new tag
    }
    this.selectedTag = '';
  }

  clearTags() {
    // Clear the tags array and reset the selected tag
    this.tags = [];
    this.selectedTag = '';
    this.filteredInventory = this.inventoryByCategory[this.selectedCategory]; // Reset inventory
  }
  deleteTag(tagToRemove: string){
      // Remove the clicked tag from the tags array
      this.tags = this.tags.filter(tag => tag !== tagToRemove);
      this.filterInventoryByTags();
  }
  


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
      // delete from frontend
      this.inventoryByCategory[this.selectedCategory] = this.inventoryByCategory[this.selectedCategory].filter(
        item => item.id !== itemToDelete.id
      );
      this.filterInventory(); // get the current inventory after deletion
  
      console.log(`Item "${itemToDelete.item_name}" deleted from category "${this.selectedCategory}"`);
  
      // deletes in the db
      if (this.user?.uid) {
        this.apiService.deleteInventory(this.user.uid, this.selectedCategory, itemToDelete.id).subscribe({
          next: (res) => {
            console.log(`Item "${itemToDelete.item_name}" successfully deleted from DB.`);
          },
          error: (err) => {
            console.error(`Failed to delete item from DB:`, err);
          }
        });
      } else {
        console.error("User ID not found — cannot delete item from DB.");
      }
    }
  }
  

}



