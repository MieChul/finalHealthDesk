// src/app/components/verify-forgot-password/verify-forgot-password.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthStateService } from '../../../shared/guards/auth-state.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { OtpService } from '../services/otp.service';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-verify-forgot-password',
  templateUrl: './verify-forgot-password.component.html',
  styleUrls: ['./verify-forgot-password.component.scss']
})
export class VerifyForgotPasswordComponent implements OnInit, OnDestroy {
  verifyForm!: FormGroup;
  isOtpSent = false;
  isResendAvailable = false;
  countdown: number = 60; // Countdown duration in seconds
  countdownSubscription!: Subscription;
  captchaVerified = false; // Track captcha verification status
  otpToken: string = ''; // Store OTP token received from server

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private otpService: OtpService,
    private authStateService: AuthStateService,
    private loader: LoaderService,
    private notificationService: NotificationService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.verifyForm = this.fb.group({
      email: ['', [Validators.email]],
      mobile: ['', [Validators.pattern(/^(\+91[-\s]?)?[0]?(91)?[789]\d{9}$/)]],
      otp: this.fb.array(new Array(6).fill('').map(() => new FormControl('', Validators.required)))
    });
  }

  getControl(controlName: string) {
    return this.verifyForm.get(controlName);
  }


  get otpControls(): FormArray {
    return this.verifyForm.get('otp') as FormArray;
  }


  // Handle reCAPTCHA resolved event
  onCaptchaResolved(captchaResponse: string | null) {
    this.captchaVerified = !!captchaResponse; // Set to true if captcha is verified (non-null response)
  }

  // Send OTP to the provided contact
  sendOtp() {
    this.loader.show();
    var isEmail = this.verifyForm.get('email')?.value ? true : false;
    if (this.captchaVerified && (this.verifyForm.get('mobile')?.value || this.verifyForm.get('email')?.value)) {
      let contactInfo = ''
      if (!isEmail)
        contactInfo = this.verifyForm.get('mobile')?.value;
      else
        contactInfo = this.verifyForm.get('email')?.value;

        this.userService.getUsername(contactInfo, isEmail).pipe(
          switchMap((response) => {
            // The first API call succeeded, proceed with the second call
            return this.otpService.sendOtp(contactInfo, isEmail);
          })
        ).subscribe({
          next: (otpResponse) => {
            this.loader.hide();
            this.notificationService.showSuccess('OTP sent successfully');
            this.otpToken = otpResponse.otpToken; // Store OTP token for verification
            this.isOtpSent = true;
            this.startCountdown();
          },
          error: (error) => {
            this.loader.hide();
            if (error.status === 404) {
              this.notificationService.showError('Not registered with app. Please SignUp');
            } else {
              console.error('Failed to send OTP', error);
              this.notificationService.showError('Failed to send OTP. Please try again');
            }
          }
        });
      
    } else {
      this.loader.hide();
      this.notificationService.showError('Please verify the captcha and provide a valid contact.');
    }
  }

  // Start the countdown timer for OTP resend
  startCountdown() {
    this.isResendAvailable = false;
    this.countdown = 60; // Reset countdown to 60 seconds
    this.countdownSubscription = interval(1000)
      .pipe(take(this.countdown))
      .subscribe({
        next: (value) => {
          this.countdown = 60 - value - 1;
        },
        complete: () => {
          this.isResendAvailable = true;
        }
      });
  }

  // Resend OTP
  resendOtp() {
    if (this.isResendAvailable) {
      this.sendOtp();
    }
  }

  // Verify the OTP and redirect to forgot-password if successful
  verifyOtp() {
    this.loader.show();
    var isEmail = this.verifyForm.get('email')?.value ? true : false;
    var contact = '';
    if (isEmail)
      contact = this.verifyForm.get('email')?.value;
    else
      contact = this.verifyForm.get('mobile')?.value; 
    const otp = this.otpControls.value.join('');

    this.otpService.verifyOtp(contact, otp, this.otpToken).subscribe({
      next: (response) => {
        this.loader.hide();
        if (response.valid) {
          this.authStateService.setOtpVerified(true); // Set OTP as verified
          this.router.navigate(['/forgot-password'], { queryParams: {contact: contact, isEmail: isEmail } });
// Navigate to forgot-password if OTP is verified
        } else {
          this.notificationService.showError('Invalid OTP. Please try again.');
        }
      },
      error: (error) => {
        this.loader.hide();
        console.error('OTP verification failed', error);
        this.notificationService.showError('OTP verification failed. Please try again.');
      }
    });
  }

  ngOnDestroy() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToSignup() {
    this.router.navigate(['/role-selection']);
  }
}
