import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ModalPopupComponent } from './modal-popup/modal-popup.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'fashion-project';
  user: User | null = null;

  constructor(private authService: AuthService, public dialog: MatDialog) {}

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      this.user = user;
    });
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
    this.authService.register(email, password).subscribe({
      next: (user) => console.log('User is Registered:', user),
      error: (err) => console.log('Registration Failed:', err)
    });
  }

  onLogin(email: string, password: string, event: Event) {
    event.preventDefault(); 
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
