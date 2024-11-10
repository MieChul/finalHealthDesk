import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Tooltip } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-records',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit, AfterViewInit {
  patients = [
    { id: 1, name: 'Amit Kumar', age: 30, mobile: '9876543210', lastVisited: '2024-06-16', view: true, history: true },
    { id: 2, name: 'Suman Reddy', age: 25, mobile: '9988776655', lastVisited: '2024-05-20', view: true, history: false },
    { id: 3, name: 'Ravi Sharma', age: 28, mobile: '9876543212', lastVisited: '2024-03-14', view: false, history: true },
    { id: 4, name: 'Anita Singh', age: 35, mobile: '9988776633', lastVisited: '2023-04-10', view: true, history: true },
    { id: 5, name: 'Manish Verma', age: 22, mobile: '9876543299', lastVisited: '2023-03-05', view: false, history: false },
    { id: 6, name: 'Priya Desai', age: 40, mobile: '9876543200', lastVisited: '2023-02-28', view: true, history: true },
  ];

  filteredPatients = [...this.patients];
  searchValue = '';
  sortDirection = 'asc';
  sortKey = '';
  showAddPatientPopup = false;
  newPatient = { name: '', age: 0, mobile: '', lastVisited: '' };
  showHistory = false;
  patientHistory: any[] = [];
  currentPatient: any;
  showModel:boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const sidebarCollapseButton = document.getElementById('sidebarCollapse');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');

    if (sidebarCollapseButton && sidebar && content) {
      sidebarCollapseButton.addEventListener('click', () => {
        sidebar.classList.toggle('expanded');
        content.classList.toggle('expanded');
      });
    }
  }

  ngAfterViewInit(): void {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => new Tooltip(tooltipTriggerEl));
  }

  searchPatient(event: any): void {
    this.searchValue = event.target.value.toLowerCase();
    this.filteredPatients = this.patients.filter(patient =>
      patient.name.toLowerCase().includes(this.searchValue)
    );
  }

  sortTable(key: keyof typeof this.filteredPatients[0]): void {
    this.sortKey = key;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredPatients.sort((a, b) => {
      if (a[key] < b[key]) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (a[key] > b[key]) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  openAddPatientPopup(): void {
    this.showModel = true;
    const addPatientModal = new bootstrap.Modal(document.getElementById('addPatientModal')!);
    addPatientModal.show();
  }

  addPatient(): void {
    const newId = this.patients.length + 1;
    const newPatient = { ...this.newPatient, id: newId, view: true, history: true };
    this.patients.push(newPatient);
    this.filteredPatients = [...this.patients];
    const addPatientModal = bootstrap.Modal.getInstance(document.getElementById('addPatientModal')!);
    addPatientModal?.hide();
  }

  viewHistory(patient: any): void {
    this.showHistory = true;
    this.currentPatient = patient;
    this.patientHistory = this.generatePatientHistory(patient);
  }

  backToMain(): void {
    this.showHistory = false;
    this.currentPatient = null;
  }

  generatePatientHistory(patient: any): any[] {
    const history = [];
    const randomCount = Math.floor(Math.random() * 5) + 1; // Vary number of records for each patient
    for (let i = 0; i < randomCount; i++) {
      history.push({
        visitedDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        illness: 'Illness ' + (i + 1),
      });
    }
    return history;
  }

  viewPatient(record: any): void {
    // Open the PDF from assets folder
    window.open(`/assets/p_${record.id}_${record.name.replace(/\s+/g, '').toLowerCase()}.pdf`, '_blank');
  }

  onScroll(): void {
    // Handle infinite scrolling logic here
  }

  createPrescription(patient: any): void {
    this.router.navigate(['physician/generate-prescription'], { state: { patient } });
  }
}
