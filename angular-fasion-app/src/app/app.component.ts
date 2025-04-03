import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ModalPopupComponent } from './modal-popup/modal-popup.component';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './api.service';
import { InventoryItem, InventoryByCategory } from './inventory.interface';import { MatButtonModule } from '@angular/material/button';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatButtonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit  {
  title = 'fashion-project';
  user: User | null = null;
  isSignUp: boolean = false; // Or true, depending on your initial state


  selectedCategory: string = 'top'; //default category
  inventoryByCategory: { [key: string]: any[] } = {};
  filteredInventory: InventoryItem[] = [];
  isLoading = true;


  constructor(private authService: AuthService, public dialog: MatDialog, private apiService: ApiService) { };

  ngOnInit() {
  }

  switchToLogin() {
    this.isSignUp = false;
  }

  switchToSignup() {
    this.isSignUp = true;
  }

  ngAfterViewInit() {
    const addButton = document.getElementById('addPopup');
    if (addButton) {
      addButton.addEventListener('click', () => this.openModal());
    }
  }

  openModal(): void {
    this.dialog.open(ModalPopupComponent, {
      width: '400px',
      panelClass: 'custom-dialog'
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
  }

  filterInventory() {
    this.filteredInventory = this.inventoryByCategory[this.selectedCategory];
  }
}



