// src/app/services/otp.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  private apiUrl = 'http://localhost:5148/api/otp'; // Backend URL

  constructor(private http: HttpClient) {}

  // Send OTP to the server
  sendOtp(contact: string, isEmail : boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, { contact : contact, isEmail : isEmail });
  }

  // Verify OTP with the server
  verifyOtp(contact: string, otp: string, otpToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify`, { contact, otp, otpToken });
  }
}
