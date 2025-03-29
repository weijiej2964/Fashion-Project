// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-add-popup',
//   templateUrl: './add-popup.component.html',
//   styleUrls: ['./add-popup.component.css']
// })
// export class AddPopupComponent {
//   isVisible = false;  // Controls the visibility of the popup
//   itemName: string = '';
//   category: string = '';
//   image: File | null = null;

//   openPopup() {
//     this.isVisible = true;
//   }

//   closePopup() {
//     this.isVisible = false;
//   }

//   onFileChange(event: any) {
//     this.image = event.target.files[0];
//   }

//   submitForm() {
//     console.log('Form submitted!', this.itemName, this.category, this.image);
//     this.closePopup();  // Optionally close the popup after submission
//   }
// }
import { Component } from '@angular/core';

@Component({
  selector: 'app-add-popup',
  standalone: true,
  templateUrl: './add-popup.component.html',
  styleUrls: ['./add-popup.component.css'],
})
export class AddPopupComponent {
  openPopup() {
    console.log('Popup opened');
    // Add your popup logic here
  }
}
