import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-physician',
  templateUrl: './physician.component.html',
  styleUrl: './physician.component.scss'
})
export class PhysicianComponent {
  showSidebar: boolean = true;
  navItems = [
    { url: '/physician', tooltip: 'Home', iconClass: 'bi bi-house' },
    { url: '/physician/design-prescription', tooltip: 'Design Prescription', iconClass: 'bi bi-file-medical' },
    { url: '/physician/patient-record', tooltip: 'Patient Record', iconClass: 'bi bi-people' },
    { url: '/physician/appointments', tooltip: 'Appointments', iconClass: 'bi bi-calendar' },
    { url: '/physician/medical-journal', tooltip: 'Medical Journal', iconClass: 'bi bi-journal-medical' },
    { url: '/physician/medical-cases', tooltip: 'Medical Cases', iconClass: 'bi bi-folder2-open' },
    { url: '/physician/survey', tooltip: 'Survey', iconClass: 'bi bi-clipboard-data' }
  ];

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (data['showSidebar'] !== undefined) {
        this.showSidebar = data['showSidebar'];
      }
    });
  }
}
