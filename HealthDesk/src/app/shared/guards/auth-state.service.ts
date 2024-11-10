// src/app/services/auth-state.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private otpVerified = false;

  constructor() {
    // Load otpVerified state from sessionStorage on service initialization
    const storedVerified = sessionStorage.getItem('otpVerified');
    this.otpVerified = storedVerified ? JSON.parse(storedVerified) : false;
  }

  setOtpVerified(verified: boolean): void {
    this.otpVerified = verified;
    sessionStorage.setItem('otpVerified', JSON.stringify(verified));
  }

  isOtpVerified(): boolean {
    return this.otpVerified;
  }

  resetOtpVerified(): void {
    this.otpVerified = false;
    sessionStorage.removeItem('otpVerified');
  }
}
