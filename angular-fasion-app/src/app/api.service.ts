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

    addInventory(userId: string, addition: object){
        return this.http.post(`${this.apiUrl}/${userId}/inventory`,addition)
    }
}
