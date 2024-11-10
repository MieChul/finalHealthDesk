// src/app/components/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { getRoleId } from '../../../shared/enum/role.enum';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  selectedRole = ''; // Pre-fetched, non-editable
  prefilledMobile = ''; // Set this based on previous verification
  prefilledEmail = ''; // Set this based on previous verification
  hide = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.selectedRole = params['role'] || null;
      if (params['isEmail'] === 'true')
        this.prefilledEmail = params['contact']
      else
        this.prefilledMobile = params['contact']
    });
    this.registerForm = this.fb.group({
      role: [{ value: this.selectedRole, disabled: true }],
      mobile: [{ value: this.prefilledMobile, disabled: true }],
      email: [{ value: this.prefilledEmail, disabled: true }],
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{5,10}$/)]],
      password: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_@.$&*-]{6,}$/)]],
      confirmPassword: ['', Validators.required]
    });
  }

  // Check if password and confirm password match
  isPasswordMatch(): boolean {
    return this.registerForm.get('password')?.value === this.registerForm.get('confirmPassword')?.value;
  }

  getControl(controlName: string) {
    return this.registerForm.get(controlName);
  }

  // Submit the form
  onSubmit(): void {
    if (this.registerForm.valid && this.isPasswordMatch()) {
      this.loaderService.show();
      var roleId = getRoleId('physician')
      // Collect form data
      const userData = {
        username: this.registerForm.get('username')?.value,
        password: this.registerForm.get('password')?.value,
        email: this.prefilledEmail,
        mobile: this.prefilledMobile,
        roleId: roleId
      };

      // Call register API
      this.userService.register(userData).subscribe({
        next: () => {
          this.loaderService.hide();
          this.notificationService.showSuccess('Registration successful. Redirecting to login...');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); // Redirect to login after successful registration
        },
        error: (err) => {
          this.loaderService.hide();
          if (err.error) {
            this.notificationService.showError(err.error);
          } else {
            this.notificationService.showError('Registration failed. Please try again.');
          }
        }
      });
    } else if (!this.isPasswordMatch()) {
      this.notificationService.showError('Passwords do not match.');
    }
  }

  // Clear the form but preserve prefilled values
  onClear(): void {
    this.registerForm.reset({
      role: { value: this.selectedRole, disabled: true },
      mobile: { value: this.prefilledMobile, disabled: !!this.prefilledMobile },
      email: { value: this.prefilledEmail, disabled: !!this.prefilledEmail }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateVerifyPassword() {
    this.router.navigate(['/verify-forgot-password']);
  }
}
