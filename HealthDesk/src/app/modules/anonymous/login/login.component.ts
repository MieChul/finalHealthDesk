import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService } from '../../../shared/services/loader.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { AuthService } from '../../../shared/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hide = true;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    // Initialize form group with controls
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Generic getter for any form control
  getControl(controlName: string) {
    return this.loginForm.get(controlName);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loaderService.show();

      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe({
        next: () => {
          this.loaderService.hide();

          const userRole =  sessionStorage.getItem('role');
          this.router.navigate([`/${userRole?.toLowerCase()}`]);
        },
        error: (err) => {
          this.loaderService.hide();
          this.notificationService.showError('Incorrect username or password. Please try again.');
        }
      });
    }
  }

  navigateToSignup() {
    this.router.navigate(['/role-selection']);
  }

  navigateVerifyPassword() {
    this.router.navigate(['/verify-forgot-password']);
  }
}
