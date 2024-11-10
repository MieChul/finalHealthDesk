// src/app/guards/otp-verification.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root',
})
export class OtpVerificationGuard implements CanActivate {
  constructor(
    private authStateService: AuthStateService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authStateService.isOtpVerified()) {
      return true; // Allow access if OTP is verified
    } else {
      // Determine which OTP verification page to redirect to based on the target route
      const targetRoute = state.url.includes('forgot-password') ? '/verify-forgot-password' : '/verify-otp';
      this.router.navigate([targetRoute]);
      return false;
    }
  }
}
