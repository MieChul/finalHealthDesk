import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Tooltip } from 'bootstrap';
@Component({
  selector: 'app-select-template',
  templateUrl: './select-template.component.html',
  styleUrls: ['./select-template.component.scss']
})
export class SelectTemplateComponent {
  templates = [
    { id: 1, name: 'Template 1', imageUrl: 'assets/template1.png' },
    { id: 2, name: 'Template 2', imageUrl: 'assets/template2.png' },
    { id: 3, name: 'Template 3', imageUrl: 'assets/template3.png' },
    { id: 4, name: 'Template 4', imageUrl: 'assets/template4.png' }
  ];

  constructor(private router: Router) { }
  ngAfterViewInit() {
    // Initialize the Bootstrap tooltip
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => new Tooltip(tooltipTriggerEl));
  }
  selectTemplate(templateId: number) {
    // Redirect to Customize Prescription with the selected template ID
    this.router.navigate(['/physician/customize-prescription'], { queryParams: { templateId } });
  }

  goBack() {
    // Hide the tooltip by disposing of it
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      const tooltipInstance = Tooltip.getInstance(tooltipTriggerEl); // Get the tooltip instance
      if (tooltipInstance) {
        tooltipInstance.dispose(); // Dispose of the tooltip
      }
    });
  
    // Navigate back to the design prescription page
    this.router.navigate(['/physician/design-prescription']);
  }
}
