import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { subscribeOn } from 'rxjs';


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



