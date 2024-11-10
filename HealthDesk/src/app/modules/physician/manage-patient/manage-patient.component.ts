import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Tooltip } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-records',
  templateUrl: './manage-patient.component.html',
  styleUrls: ['./manage-patient.component.scss']
})
export class ManagePatientComponent implements OnInit, AfterViewInit {
  patients :any[]= [];
  nameError: string | null = null;
  ageError: string | null = null;
  mobileError: string | null = null;
  filteredPatients = [...this.patients];
  searchValue = '';
  sortDirection = 'asc';
  sortKey = '';
  showAddPatientPopup = false;
  newPatient = { name: '', age: 0, mobile: '', lastVisited: '', gender:'' };
  showHistory = false;
  patientHistory: any[] = [];
  currentPatient: any;
  showModel:boolean = false;
  genderError: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.destroyTooltips();
    this.getUniquePatientsFromIndexedDB().then(() => {
      this.populatePatientsWithHistoryStatus();
    });
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

    const addPatientModal = document.getElementById('addPatientModal');
    if (addPatientModal) {
      addPatientModal.addEventListener('hide.bs.modal', () => {
        this.resetForm();  // Reset the form when modal is closed
      });
    }
  }

  searchPatient(event: any): void {
    this.destroyTooltips();
    this.searchValue = event.target.value.toLowerCase();
    this.filteredPatients = this.patients.filter(patient =>
      patient.name.toLowerCase().includes(this.searchValue)
    );
  }

  sortTable(key : string): void {
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
    this.destroyTooltips();
    this.showModel = true;
    const addPatientModal = new bootstrap.Modal(document.getElementById('addPatientModal')!);
    addPatientModal.show();
  }

  addPatient(): void {
    this.destroyTooltips();
    const isValidName = this.validateName(this.newPatient.name);
    const isValidAge = this.validateAge(this.newPatient.age);
    const isValidPhone = this.validatePhone(this.newPatient.mobile);
    const isValidGender = this.validateGender(this.newPatient.gender);

    if (!isValidName || !isValidAge || !isValidPhone) {
      return;
    }
    const newId = this.patients.length + 1;
    const newPatient = { 
      id: newId, 
      name: this.newPatient.name, 
      age: this.newPatient.age, 
      mobile: this.newPatient.mobile, 
      lastVisited: new Date().toISOString().split('T')[0],
      view: false, 
      history: false,
      gender: this.newPatient.gender,  
    };
  
    // Add to IndexedDB
    this.addPatientToIndexedDB(newPatient);
    
    this.patients.push(newPatient);
    this.filteredPatients = [...this.patients];
  
    const addPatientModal = bootstrap.Modal.getInstance(document.getElementById('addPatientModal')!);
    addPatientModal?.hide();
    this.resetForm();
  }

  async addPatientToIndexedDB(patient: any) {
    const db = await this.openIndexedDB();
    const transaction = db.transaction(['patients'], 'readwrite');
    const store = transaction.objectStore('patients');
    store.add(patient);
    transaction.oncomplete = () => console.log('Patient added to IndexedDB');
  }

  resetForm() {
    this.newPatient = { name: '', age: 0, mobile: '', lastVisited: '', gender:'' };
  }

  openIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('prescriptionsDB', 2);
  
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('patients')) {
          db.createObjectStore('patients', { keyPath: 'id', autoIncrement: true });
        }
        let pdfStore;
        if (!db.objectStoreNames.contains('pdfs')) {
          pdfStore = db.createObjectStore('pdfs', { keyPath: 'name' }); // Ensure keyPath is 'name'
      } else {
        pdfStore = event.currentTarget.transaction?.objectStore('pdfs');
      }

        if (!pdfStore.indexNames.contains('patientId')) {
          pdfStore.createIndex('patientId', 'patientId', { unique: false });
        }
      };
  
      request.onsuccess = (event: any) => resolve(event.target.result);
      request.onerror = (event: any) => reject(event.target.error);
    });
  }

  backToMain(): void {
    this.destroyTooltips();
    this.showHistory = false;
    this.currentPatient = null;
  }

  generatePatientHistory(patient: any): any[] {
    this.destroyTooltips();
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


  createPrescription(patient: any): void {
    this.router.navigate(['physician/generate-prescription'], { state: { patient } });
  }

  createCertificate(patient: any): void {
    this.router.navigate(['physician/generate-certificate'], { state: { patient } });
  }

  
  async getUniquePatientsFromIndexedDB() {
    const db = await this.openIndexedDB();
    const transaction = db.transaction(['patients'], 'readonly');
    const store = transaction.objectStore('patients');
    const getAllRequest = store.getAll();
  
    getAllRequest.onsuccess = () => {
      this.patients = getAllRequest.result;
      this.filteredPatients = [...this.patients];
    };
  }
  
  viewPatient(patient: any, pdfid:number = 0): void {
    this.getLatestPdfByPatientId(patient.id, pdfid).then(async (pdfName) => {
      if (pdfName) {
        try {
          const pdfBlob = await this.getPdfFromIndexedDB(pdfName);
          if (pdfBlob) {
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');
          } else {
            console.error('PDF not found in IndexedDB');
          }
        } catch (error) {
          console.error('Error retrieving PDF from IndexedDB', error);
        }
      } else {
        alert('No PDF found for this patient.');
      }
    });
  }
  async getLatestPdfByPatientId(patientId: number, pdfId:number = 0): Promise<string | null> {
    const db = await this.openIndexedDB();
    const transaction = db.transaction(['pdfs'], 'readonly');
    const store = transaction.objectStore('pdfs');
    const index = store.index('patientId');
    const getAllRequest = index.getAll(patientId);
  
    return new Promise((resolve) => {
      getAllRequest.onsuccess = () => {
        const pdfs = getAllRequest.result;
        if (pdfs && pdfs.length > 0) {
          
          // Get the latest PDF
          if(pdfId > 0)
          {
            const latestPdf = pdfs.filter(pdf =>
              pdf.prescriptionId ==pdfId
            );
            resolve(latestPdf[0].name);
          }
          else
          {
            const latestPdf = pdfs.reduce((latest, current) => {
              return new Date(latest.date) > new Date(current.date) ? latest : current;
            });
            resolve(latestPdf.name);
          }

         
        } else {
          resolve(null);
        }
      };
    });
  }

  async getPdfFromIndexedDB(pdfName: string): Promise<Blob | null> {
    const db = await this.openIndexedDB();
    const transaction = db.transaction(['pdfs'], 'readonly');
    const store = transaction.objectStore('pdfs');
    const getRequest = store.get(pdfName);
  
    return new Promise((resolve, reject) => {
      getRequest.onsuccess = () => {
        const result = getRequest.result;
        if (result) {
          resolve(result.pdfBlob); // Return the PDF Blob
        } else {
          resolve(null);
        }
      };
  
      getRequest.onerror = () => {
        reject('Error fetching PDF from IndexedDB');
      };
    });
  }
  async enableHistoryButton(patientId: number): Promise<boolean> {
    const db = await this.openIndexedDB();
    const transaction = db.transaction(['pdfs'], 'readonly');
    const store = transaction.objectStore('pdfs');
    const index = store.index('patientId');
    const countRequest = index.count(patientId);
  
    return new Promise((resolve) => {
      countRequest.onsuccess = () => resolve(countRequest.result > 1);
    });
  }

  async populatePatientsWithHistoryStatus() {
    for (const patient of this.patients) {
      const hasHistory = await this.enableHistoryButton(patient.id);
      patient.history = hasHistory;
    }
  }

  viewHistory(patient: any): void {
    this.destroyTooltips();
    this.getHistoryByPatientId(patient.id).then((history) => {
      this.showHistory = true;
      this.patientHistory = history;
      this.currentPatient = patient;
    });
  }
  
  // Fetch all PDFs except the latest one by patient ID
  async getHistoryByPatientId(patientId: number): Promise<any[]> {
    const db = await this.openIndexedDB();
    const transaction = db.transaction(['pdfs'], 'readonly');
    const store = transaction.objectStore('pdfs');
    const index = store.index('patientId');
    const getAllRequest = index.getAll(patientId);
  
    return new Promise((resolve) => {
      getAllRequest.onsuccess = () => {
        const pdfs = getAllRequest.result;
        if (pdfs && pdfs.length > 1) {
          const latestPdf = pdfs.reduce((latest, current) => {
            return new Date(latest.date) > new Date(current.date) ? latest : current;
          });
          const history = pdfs;
          resolve(history);
        } else {
          resolve([]);
        }
      };
    });
  }
  
  destroyTooltips() {
    const tooltips = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltips.forEach(tooltipTriggerEl => {
      const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
      if (tooltipInstance) {
        tooltipInstance.dispose();
      }
    });
  }

  validateName(name: string): boolean {
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      this.nameError = 'Name can only contain letters and spaces.';
      return false;
    }

    // Check for unique name
    if (this.patients.some(patient => patient.name.toLowerCase() === name.toLowerCase())) {
      this.nameError = 'Patient with this name already exists.';
      return false;
    }

    this.nameError = null;
    return true;
  }

  validateAge(age: number): boolean {
    if (age < 1 || age > 150) {
      this.ageError = 'Age must be between 1 and 150.';
      return false;
    }

    this.ageError = null;
    return true;
  }

  validatePhone(phone: string): boolean {
    const phoneRegex = /^[789]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      this.mobileError = 'Enter a valid 10-digit Indian phone number.';
      return false;
    }

    if (this.patients.some(patient => patient.mobile === phone)) {
      this.mobileError = 'A patient with this phone number already exists.';
      return false;
    }

    this.mobileError = null;
    return true;
  }

  validateGender(gender: string): boolean {
    if (!gender) {
      this.genderError = 'Please select a gender.';
      return false;
    }
    
    this.genderError = null;
    return true;
  }

}
