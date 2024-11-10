// src/app/components/forgot-password/forgot-password.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  contactInfo: string = ''; // Store mobile or email
  isEmail = false;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private notification: NotificationService,
    private loader: LoaderService
  ) { }

  ngOnInit(): void {
    // Retrieve contact info (mobile or email) from query parameters
    this.route.queryParams.subscribe(params => {
      this.isEmail = params['isEmail'] === 'true';
      this.contactInfo = params['contact']
    });

    this.forgotPasswordForm = this.fb.group({
      contactInfo: [{ value: this.contactInfo, disabled: true }],
      password: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_@.$&*-]{6,}$/)]],
      confirmPassword: ['', Validators.required]
    });
  }

  getControl(controlName: string) {
    return this.forgotPasswordForm.get(controlName);
  }

  onSubmit() {
    this.loader.show();
    if (this.forgotPasswordForm.valid && this.isPasswordMatch()) {
      // Submit the new password
      const newPassword = this.forgotPasswordForm.get('password')?.value;

      this.userService.resetPassword(this.contactInfo, newPassword, this.isEmail).subscribe({
        next: () => {
          this.loader.hide();
          this.notification.showSuccess('Password successfully reset! Redirecting to login...');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (err) => {
          this.loader.hide();
          this.notification.showError(err.error.message || 'Password reset failed. Please try again.');
        }
      });
    }
  }

  isPasswordMatch(): boolean {
    var match = this.forgotPasswordForm.get('password')?.value === this.forgotPasswordForm.get('confirmPassword')?.value;
    if(!match)
      this.loader.hide();
    return match;
  }
}
