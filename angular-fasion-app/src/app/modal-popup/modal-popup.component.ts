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
    MatOptionModule
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
  categories: string[] = ['Tops', 'Bottoms', 'Outerwear', 'Accessory', 'Shoes']; // Sample categories
  

  constructor(public dialogRef: MatDialogRef<ModalPopupComponent>, private sanitizer: DomSanitizer) {}

  closeModal(): void {
    this.dialogRef.close();
  }

  submitForm(): void {
    // Handle form submission
    console.log('Item Name:', this.itemName);
    console.log('Item Description:', this.itemDescription);
    console.log('Category:', this.selectedCategory);
    console.log('Image URL:', this.imageUrl);

    // Close the modal after submission
    this.dialogRef.close();
  }

  onImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Using sanitizer to bypass security check for the image URL
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
}
