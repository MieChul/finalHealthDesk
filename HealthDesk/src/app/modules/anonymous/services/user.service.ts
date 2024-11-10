import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5148/api/user';

  constructor(private http: HttpClient) { }


  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  resetPassword(contact: string, newPassword: string, isEmail: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { contact, newPassword, isEmail });
  }

  getUsername(contact: string, isEmail: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/get-username`, { contact, isEmail });
  }
}
