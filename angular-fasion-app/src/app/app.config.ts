import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideHttpClient } from '@angular/common/http';


const firebaseConfig = {
  apiKey: "AIzaSyAq7_H5i_ojYQAVYVNAG8usMun5YRX0vUY",
  authDomain: "fashion-project-e2aba.firebaseapp.com",
  projectId: "fashion-project-e2aba",
  storageBucket: "fashion-project-e2aba.firebasestorage.app",
  messagingSenderId: "156468025393",
  appId: "1:156468025393:web:72f80e880c47dca37f5d10"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideHttpClient()
  ],
};
