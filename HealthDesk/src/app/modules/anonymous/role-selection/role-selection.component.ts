import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-select',
  templateUrl: './role-selection.component.html',
  styleUrls: ['./role-selection.component.scss']
})
export class RoleSelectComponent {
  constructor(private router: Router) {}
  selectRole(role: string) {
    this.router.navigate(['/verify-otp'], { queryParams: { role } });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateVerifyPassword() {
    this.router.navigate(['/verify-forgot-password']);
  }
}
