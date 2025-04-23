// import { Component } from '@angular/core';
// import { MatDialogRef } from '@angular/material/dialog';
// import { CommonModule } from '@angular/common';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatButtonModule } from '@angular/material/button';

// @Component({
//   selector: 'app-modal-popup',
//   standalone: true,
//   imports: [CommonModule, MatDialogModule, MatButtonModule],
//   templateUrl: './modal-popup.component.html',
//   styleUrls: ['./modal-popup.component.css']
// })
// export class ModalPopupComponent {
//   constructor(public dialogRef: MatDialogRef<ModalPopupComponent>) {}

//   closeModal(): void {
//     this.dialogRef.close();
//   }
// }


// import { Component } from '@angular/core';
// import { MatDialogRef } from '@angular/material/dialog';
// import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel
// import { CommonModule } from '@angular/common';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatButtonModule } from '@angular/material/button';
// import { MatFormFieldModule } from '@angular/material/form-field';  // For form fields
// import { MatInputModule } from '@angular/material/input';  // For input fields
// import { DomSanitizer, SafeUrl } from '@angular/platform-browser'; 
import { Component,ViewEncapsulation  } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';  // Required for mat-select and mat-option
import { MatOptionModule } from '@angular/material/core';  // Required for mat-option
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';  // SafeUrl for image preview
import {MatIconModule} from '@angular/material/icon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
    // HttpClient,
    HttpClientModule,
  ],
  templateUrl: './modal-popup.component.html',
  styleUrls: ['./modal-popup.component.css','styles.css'],
  
  encapsulation: ViewEncapsulation.None
})
export class ModalPopupComponent {
  itemName: string = '';
  itemDescription: string = '';
  selectedCategory: string = '';
  // imageUrl: string | ArrayBuffer | null = null; // To store image preview
  imageUrl: SafeUrl | null = null; 
  categories: string[] = ['Top', 'Bottom', 'Outerwear', 'Accessory', 'Shoes']; // Sample categories
  tagsArray: string[] = []; // Array for managing tags
  newTag: string = '';
  imageBase64: string | null = null;
  // authService: any;
  user: any;
 
  inventoryByCategory: any;
  constructor(public dialogRef: MatDialogRef<ModalPopupComponent>, private sanitizer: DomSanitizer, private apiService: ApiService, private authService: AuthService) {}

  closeModal(): void {
    this.dialogRef.close();
  }

  submitForm(): void {
    // Handle form submission

    this.authService.getUser().subscribe((user: any) => {
      this.user = user; 

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
      "item_id": Math.floor(Math.random() * 1000000)+1, //generates random # between 1 and 1,000,000(inclusive)
      "image_blob": this.imageBase64,
      "image_url" : "google.com"
      }
      this.apiService.addInventory(this.user.uid, jsonFile).subscribe({
        next: (response) => {
          console.log('Sent to DB successfully!', response);
        },
        error: (error) => {
          console.error('Error sending to DB:', error);
        }
      });
    //need to send this json to db.
     
    // Close the modal after submission
        this.dialogRef.close();
    });
  }

  addWord(): void {
    if (this.newTag.trim() && !this.tagsArray.includes(this.newTag)) {
      this.tagsArray.push(this.newTag.trim());
      this.newTag = ''; // Clear the input after adding the tag
    }
  }

  // Function to remove a word (tag) from the array
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
  
          // Convert canvas to Base64 (keeping variable name as imageBlob)
          this.imageBase64 = canvas.toDataURL(file.type);
          this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.imageBase64);
  
          console.log('Resized Base64 Image:', this.imageBase64);
        };
      };
  
      reader.readAsDataURL(file);
    }
  }
  
  

  
  
}
