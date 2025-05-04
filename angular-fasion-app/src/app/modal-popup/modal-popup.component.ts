import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http'; // HttpClientModule is imported here
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-modal-popup',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    HttpClientModule, // Make sure this is included if needed directly in the component
  ],
  templateUrl: './modal-popup.component.html',
  styleUrls: ['./modal-popup.component.css', 'styles.css'],

  encapsulation: ViewEncapsulation.None
})
export class ModalPopupComponent {
  itemName: string = '';
  itemDescription: string = '';
  selectedCategory: string = '';
  imageUrl: SafeUrl | null = null;
  categories: string[] = ['Top', 'Bottom', 'Outerwear', 'Accessory', 'Shoes']; // Sample categories
  tagsArray: string[] = []; // Array for managing tags
  newTag: string = '';
  imageBase64: string | null = null;
  user: any; // Or your User type

  constructor(
    public dialogRef: MatDialogRef<ModalPopupComponent>,
    private sanitizer: DomSanitizer,
    private apiService: ApiService,
    private authService: AuthService // Assuming AuthService is needed here
  ) { }

  // This method can be used for a Cancel button
  closeModal(): void {
    this.dialogRef.close(false); // Close without indicating success
  }

  submitForm(): void {
    // Use the user from the authService subscription
    this.authService.getUser().subscribe((user: any) => {
      this.user = user;

      if (!this.user?.uid) {
        console.error("User ID not found — cannot add item to DB.");
        this.dialogRef.close(false); // Close and indicate failure
        return; // Stop execution
      }

      console.log('Item Name:', this.itemName);
      console.log('Item Description:', this.itemDescription);
      console.log('Category:', this.selectedCategory);
      console.log('Tags:', this.tagsArray);
      console.log('Image Blob:', this.imageBase64);

      const jsonFile = {
        "item_name": this.itemName,
        "item_desc": this.itemDescription,
        "category": this.selectedCategory,
        "tags": this.tagsArray,
        // **Caution:** Client-side random ID generation can lead to collisions.
        // Consider having your backend generate unique IDs.
        "item_id": Math.floor(Math.random() * 1000000) + 1,
        "image_blob": this.imageBase64,
        "image_url": "google.com" // Placeholder?
      };

      // Add the item to the DB and handle the response
      this.apiService.addInventory(this.user.uid, jsonFile).subscribe({
        next: (response) => {
          console.log('Sent to DB successfully!', response);
          // Close the modal AFTER successful submission and pass 'true'
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error sending to DB:', error);
          // Close the modal on error and pass 'false'
          this.dialogRef.close(false); // Or pass the error object if needed
        }
      });

      // **IMPORTANT:** Remove the dialogRef.close() call here,
      // as the closing should happen within the subscribe callbacks.
      // this.dialogRef.close(); // <--- REMOVE THIS LINE
    });
  }

  // ... (rest of your methods: addWord, removeTag, onImageUpload)
  addWord(): void {
    if (this.newTag.trim() && !this.tagsArray.includes(this.newTag.trim())) {
      this.tagsArray.push(this.newTag.trim());
      this.newTag = ''; // Clear the input after adding the tag
    }
  }

  removeTag(index: number): void {
    console.log('Remove button clicked for index:', index);
    this.tagsArray.splice(index, 1); // Remove the word at the specified index
  }

  onImageUpload(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;

          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const aspectRatio = width / height;

            if (width > height) {
              width = MAX_WIDTH;
              height = MAX_WIDTH / aspectRatio;
            } else {
              height = MAX_HEIGHT;
              width = MAX_HEIGHT * aspectRatio;
            }
          }

          // Create a canvas for resizing
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = width;
          canvas.height = height;

          // Draw resized image onto canvas
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert canvas to Base64
          this.imageBase64 = canvas.toDataURL(file.type);
          this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.imageBase64);

          console.log('Resized Base64 Image:', this.imageBase64);
        };
      };

      reader.readAsDataURL(file);
    }
  }
}