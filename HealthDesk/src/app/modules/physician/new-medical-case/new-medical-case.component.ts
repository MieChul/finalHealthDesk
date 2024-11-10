import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-medical-case',
  templateUrl: './new-medical-case.component.html',
  styleUrls: ['./new-medical-case.component.scss']
})
export class NewMedicalCaseComponent {
  speciality = '';
  diagnosis = '';
  patientInitials = '';
  age: number | null = null;
  chiefComplaints: string[] = [''];
  pastHistory = '';
  examination = '';
  investigation = '';
  treatment = '';
  caseSummary = '';
  images: File[] = [];
  validInitials: boolean = true;
  ageError: string | null = null;

  constructor(private router: Router) { }

  submitCase() {
    this.validInitials = /^[A-Za-z.']{3}$/.test(this.patientInitials);
    if (!this.validInitials) return;
    if (!this.validateAge()) return;
    // Logic to handle form submission
    console.log({
      speciality: this.speciality,
      diagnosis: this.diagnosis,
      patientInitials: this.patientInitials,
      age: this.age,
      chiefComplaints: this.chiefComplaints,
      pastHistory: this.pastHistory,
      examination: this.examination,
      investigation: this.investigation,
      treatment: this.treatment,
      caseSummary: this.caseSummary,
      images: this.images
    });
    this.router.navigate(['/physician/medical-cases']);
  }

  goBack() {
    this.router.navigate(['/physician/medical-cases']);
  }

  addImage() {
    if (this.images.length < 3) {
      this.images.push(null as any); // Allow null as a placeholder for a File type
    }
  }
  removeImage(index: number) {
    this.images.splice(index, 1);
  }

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.images[index] = file;
    }
  }

  addComplaint() {
    this.chiefComplaints.push('');
  }

  validateAge(): boolean {
    if ((this.age ?? 0) < 1 || (this.age ?? 0) > 150) {
      this.ageError = 'Age must be between 1 and 150.';
      return false;
    }

    this.ageError = null;
    return true;
  }

  removeComplaint(index: number) {
    this.chiefComplaints.splice(index, 1);
  }
}
