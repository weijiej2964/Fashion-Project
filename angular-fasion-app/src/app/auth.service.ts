import { Injectable, NgZone } from '@angular/core';
import { Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  UserCredential } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth, private ngZone: NgZone) {}

  register(email: string, password: string) {
    return from(new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(this.auth, email, password)
        .then(result => {
          // Ensure the resolution happens inside Angular's zone.
          this.ngZone.run(() => resolve(result));
        })
        .catch(error => {
          this.ngZone.run(() => reject(error));
        });
    }));
  }

  login(email: string, password: string) {
    console.log('Attempting Firebase login'); // Debugging log
  
    return from(new Promise<UserCredential>((resolve, reject) => {
      signInWithEmailAndPassword(this.auth, email, password)
        .then(result => {
          console.log('Firebase login successful', result.user); // Debugging log
          this.ngZone.run(() => resolve(result));
        })
        .catch(error => {
          console.error('Firebase login error:', error); // Debugging log
          this.ngZone.run(() => reject(error));
        });
    }));
  }
  

  logout() {
    return from(new Promise((resolve, reject) => {
      signOut(this.auth)
        .then(() => {
          this.ngZone.run(() => resolve(null));
        })
        .catch(error => {
          this.ngZone.run(() => reject(error));
        });
    }));
  }

  getUser(): Observable<User | null> {
    return new Observable(subscriber => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        this.ngZone.run(() => {
          console.log('Auth state changed:', user);
          subscriber.next(user);
        });
      });

      return () => unsubscribe();
    });
  }
  
}
