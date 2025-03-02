import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { subscribeOn } from 'rxjs';

// Stuff I added for database:
import { initializeApp } from "firebase/app";
import { getDatabase,ref,set } from "firebase/database";
const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://fashion-project-e2aba-default-rtdb.firebaseio.com/:null",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

// function writeUserData(uid, name, email, imageUrl) {
//   set(ref(database, 'users/' + uid), {
//     username: name,
//     email: email,
//     profile_picture : imageUrl
//   });
//}
type Category = 'Tops' | 'Bottoms' | 'Shoes' | 'Hats' | 'Glasses' | 'Earrings' | 'Necklaces' | 'Bracelets' | 'Watches' | 'Rings';
function addClothes(itemID: number, uid: number, itemName: string, itemDesc: string, image_url: string, imageBlob: Blob, category: Category) {
  set(ref(database, 'Clothes/' + itemID), {
    UID: uid,
    Item_Name: itemName,
    Item_Desc: itemDesc,
    Image_url: image_url,
    Image_Blob: imageBlob,
    Category: category
  });

  // Function to add outfits data
function addOutfit(outfitID: number, outfitName: string, items: { [key: string]: boolean }) {
  set(ref(database, 'Outfits/' + outfitID), {
    Outfit_Name: outfitName,
    Items: items
  });
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'fashion-project';
  user: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      this.user = user;
    });
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
    event.preventDefault(); // Prevents page refresh
    console.log('Login button clicked with:', email, password);

    this.authService.login(email, password).subscribe({
      next: (user) => console.log('User logged in:', user),
      error: (err) => console.error('Login failed:', err)
    });
  }

  onGoogleSignIn(event: Event) {
    event.preventDefault(); 
    this.authService.googleSignIn().subscribe({
      next: (user) => {
        console.log('Google Sign-In successful, user:', user);
      },
      error: (err) => {
        console.error('Google Sign-In error:', err);
      }
    });
  }

  onLogout() {
    this.authService.logout().subscribe(() => {
      console.log('User Logged out');
    });
  }
}



