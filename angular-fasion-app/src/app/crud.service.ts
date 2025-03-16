import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  // Address to where the API server is held
  private expressUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(`${this.expressUrl}/`);
  }

  uploadData(user_id: string, data: JSON): Observable<any> {
    return this.http.post(`${this.expressUrl}/${user_id}/inventory/upload`, data)
  }
}
