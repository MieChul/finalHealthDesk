import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5148/api/auth';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/login`,
      { username, password }// Send cookies with the request
    ).pipe(
      tap((response: any) => {
        // Store role and username in sessionStorage after login
        sessionStorage.setItem('role', response.role);
        sessionStorage.setItem('username', response.username);
      })
    );
  }
  
 logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        console.log('Logged out successfully');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('username');
      },
      error: (error) => console.error('Logout failed', error),
    });
  }

}
