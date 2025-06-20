//api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { user } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = 'http://localhost:3000';
    constructor(private http: HttpClient) { }
    getInventory(userId: string) {
        return this.http.get(
            `${this.apiUrl}/${userId}/inventory`)
    }
    deleteInventory(userId: string, category: string, clothingId: string) {
        return this.http.delete(`${this.apiUrl}/${userId}/clothing/${category}/${clothingId}`)
    }
    

    // addInventory(userId: string, addition: object){
    //     return this.http.post(`${this.apiUrl}/${userId}/inventory/upload`,JSON.stringify(addition))
    // }

    // addInventory(userId: string, addition: object) {
    //     const headers = { 'Content-Type': 'application/json' };
    //     console.log('URL:', `${this.apiUrl}/${userId}/inventory/upload`);
    //     console.log('Payload:', addition);
        
    //     return this.http.post(`${this.apiUrl}/${userId}/inventory/upload`, addition, { headers });

        
    // }

    addInventory(userId: string, addition: object) {
        return this.http.post(`${this.apiUrl}/${userId}/inventory/upload`, addition)

      }
      
    
}
