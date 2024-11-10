import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tooltip } from 'bootstrap';

@Component({
  selector: 'app-design-prescription',
  templateUrl: './design-prescription.component.html',
  styleUrls: ['./design-prescription.component.scss']
})
export class DesignPrescriptionComponent implements OnInit {
  prescriptions: any[] = [];
  filteredPrescriptions: any[] = [];
  sortKey: string = '';
  sortAscending: boolean = true;// Replace 'any' with proper type
  constructor(private router: Router) { }

  ngOnInit(): void {
    // Load existing prescriptions
    this.loadPrescriptions();
  }

  editPrescription(prescription: any) {
    this.router.navigate(['/physician/customize-prescription'], { queryParams: { id: prescription.id } });
  }

  async deletePrescription(prescription: any) {
    try {
      await this.deletePrescriptionFromIndexedDB(prescription.id);
      this.prescriptions = this.prescriptions.filter(p => p.id !== prescription.id);
      this.filteredPrescriptions = [...this.prescriptions];
    } catch (error) {
      console.error('Error deleting prescription from IndexedDB', error);
    }
  }

  addDesignPrescription() {
    // Redirect to the CustomizePrescriptionComponent for adding a new prescription
    this.router.navigate(['/physician/select-template']);
  }

  async loadPrescriptions() {
   try {
      const prescriptions = await this.getAllPrescriptionsFromIndexedDB();
      if (prescriptions) {
        this.prescriptions = prescriptions;
        this.filteredPrescriptions = [...this.prescriptions];
      }
    } catch (error) {
      console.error('Error loading prescriptions from IndexedDB', error);
    }
  }

  filterPrescriptions() {
    const filterValue = (document.getElementById('filterName') as HTMLInputElement).value.toLowerCase();
    this.filteredPrescriptions = this.prescriptions.filter(p => p.name.toLowerCase().includes(filterValue));
  }

  sortPrescriptions(key: string) {
    if (this.sortKey === key) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortKey = key;
      this.sortAscending = true;
    }
    this.filteredPrescriptions.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];
      if (this.sortAscending) {
        return valA < valB ? -1 : valA > valB ? 1 : 0;
      } else {
        return valA > valB ? -1 : valA < valB ? 1 : 0;
      }
    });
  }

  async viewPrescription(prescription: any) {
    const pdfKey = `${prescription.name}_template${prescription.templateId}.pdf`;

    try {
      const pdfBlob = await this.getPdfFromIndexedDB(pdfKey);
      if (pdfBlob) {
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
      } else {
        console.error('PDF not found in IndexedDB');
      }
    } catch (error) {
      console.error('Error retrieving PDF from IndexedDB', error);
    }
  }
  async getPdfFromIndexedDB(pdfName: string): Promise<Blob | null> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('prescriptionsDB', 2);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('pdfs')) {
          db.createObjectStore('pdfs', { keyPath: 'name' });
        }
      };

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction(['pdfs'], 'readonly');
        const store = transaction.objectStore('pdfs');
        const getRequest = store.get(pdfName);

        getRequest.onsuccess = (event: any) => {
          const result = event.target.result;
          if (result) {
            resolve(result.pdfBlob);
          } else {
            resolve(null); // PDF not found
          }
        };

        getRequest.onerror = () => {
          reject(new Error('Error retrieving PDF from IndexedDB'));
        };
      };

      request.onerror = () => {
        reject(new Error('Error opening IndexedDB'));
      };
    });
  }

  async getAllPrescriptionsFromIndexedDB(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('prescriptionsDB', 2);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('prescriptions')) {
          db.createObjectStore('prescriptions', { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction(['prescriptions'], 'readonly');
        const store = transaction.objectStore('prescriptions');
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = (event: any) => {
          resolve(event.target.result);
        };

        getAllRequest.onerror = () => {
          reject(new Error('Error retrieving prescriptions from IndexedDB'));
        };
      };

      request.onerror = () => {
        reject(new Error('Error opening IndexedDB'));
      };
    });
  }

  async deletePrescriptionFromIndexedDB(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('prescriptionsDB', 2);

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction(['prescriptions'], 'readwrite');
        const store = transaction.objectStore('prescriptions');
        const deleteRequest = store.delete(id);

        deleteRequest.onsuccess = () => {
          resolve();
        };

        deleteRequest.onerror = () => {
          reject(new Error('Error deleting prescription from IndexedDB'));
        };
      };

      request.onerror = () => {
        reject(new Error('Error opening IndexedDB'));
      };
    });
  }
 
}
