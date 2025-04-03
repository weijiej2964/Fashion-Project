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
    ApiService,
    HttpClient
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
  imageBlob: Blob | null = null;
  authService: any;
  user: any;
  apiService: any;
  inventoryByCategory: any;
  constructor(public dialogRef: MatDialogRef<ModalPopupComponent>, private sanitizer: DomSanitizer) {}

  closeModal(): void {
    this.dialogRef.close();
  }

  submitForm(): void {
    // Handle form submission
    console.log('Item Name:', this.itemName); 
    console.log('Item Description:', this.itemDescription);
    console.log('Category:', this.selectedCategory);
    console.log('Tags:', this.tagsArray);
    console.log('Image URL:', this.imageUrl);
    this.authService.getUser().subscribe(user => {
          this.user = user;

          console.log(this.user);

          this.apiService.index(this.user?.uid).subscribe(data => {
            this.inventoryByCategory = this.transformInventoryData(data);
            console.log('transformed inventory:', this.inventoryByCategory);
            this.filterInventory();
            console.log('filtered inventory:', this.filteredInventory);
          })
        // Close the modal after submission
        this.dialogRef.close();
  }
}
  transformInventoryData(data: any): any {
    throw new Error('Method not implemented.');
  }
  filterInventory() {
    throw new Error('Method not implemented.');
  }
  filteredInventory(arg0: string, filteredInventory: any) {
    throw new Error('Method not implemented.');
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
  
  // onImageUpload(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       // Using sanitizer to bypass security check for the image URL
  //       this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  onImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
  
      // Convert file to Base64 URL for preview
      reader.onload = (e: any) => {
        // Use the sanitizer for the image URL (Angular-specific security measure)
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
  
        // Convert the file to a Blob
        const binaryString = atob(e.target.result.split(',')[1]); // Decode Base64
        const arrayBuffer = new ArrayBuffer(binaryString.length);
        const uint8Array = new Uint8Array(arrayBuffer);
  
        for (let i = 0; i < binaryString.length; i++) {
          uint8Array[i] = binaryString.charCodeAt(i);
        }
  
        this.imageBlob = new Blob([uint8Array], { type: file.type });
        console.log('Blob created:', this.imageBlob);
      };
  
      reader.readAsDataURL(file); // Read the file as a Base64 string
    }
  }
  
}
