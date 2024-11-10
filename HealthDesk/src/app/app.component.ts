// app.component.ts
import { Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthStateService } from './shared/guards/auth-state.service';
import { LoaderService } from './shared/services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoading: Observable<boolean>;
  showLayout = false;
  navItems: { icon: string; label: string }[] = [];
  constructor(private loaderService: LoaderService, private authStateService: AuthStateService) {
    this.isLoading = this.loaderService.isLoading$;
    this.authStateService.resetOtpVerified();
  }

  ngOnInit(): void {
    this.checkUserRole();
    this.setNavItemsBasedOnRole();
  }

  checkUserRole() {
    const userRole = sessionStorage.getItem('role');
    if (userRole)
      this.showLayout = true;
  }

  setNavItemsBasedOnRole() {
    const role = sessionStorage.getItem('role');
    this.showLayout = !!role && role !== 'admin';
    if( this.showLayout)
    {
      if (role === 'physician') {
        this.navItems = [
          { icon: 'patient', label: 'Patients' },
          { icon: 'schedule', label: 'Schedule' },
          { icon: 'report', label: 'Reports' }
        ];
      } else if (role === 'patient') {
        this.navItems = [
          { icon: 'profile', label: 'My Profile' },
          { icon: 'appointment', label: 'Appointments' },
          { icon: 'history', label: 'History' }
        ];
      }
    }
  }
}
