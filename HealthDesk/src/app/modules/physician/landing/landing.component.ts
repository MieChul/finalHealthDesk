import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  showSidebar = true;
  constructor() { }

  ngOnInit(): void { 
    this.showSidebar = location.pathname !== '/';
    this.openIndexedDB();
  }

  openIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('prescriptionsDB', 2); // Ensure you use version 2 or higher for upgrade
  
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        
        // Ensure profiles store exists
        let profileStore;
        if (!db.objectStoreNames.contains('profiles')) {
          profileStore = db.createObjectStore('profiles', { keyPath: 'id', autoIncrement: true });
          profileStore.createIndex('name', 'name', { unique: true }); // Add 'name' index
        }
          profileStore = request?.transaction?.objectStore('profiles');
          if (!profileStore?.indexNames.contains('name')) {
            profileStore?.createIndex('name', 'name', { unique: true }); // Ensure 'name' index exists

          if (!db.objectStoreNames.contains('prescriptions')) {
            db.createObjectStore('prescriptions', { keyPath: 'id', autoIncrement: true });
          }
          if (!db.objectStoreNames.contains('pdfs')) {
            db.createObjectStore('pdfs', { keyPath: 'name' });
          }
        }
        
        // Ensure investigations store exists
        let investigationStore;
        if (!db.objectStoreNames.contains('investigations')) {
          investigationStore = db.createObjectStore('investigations', { keyPath: 'id', autoIncrement: true });
          investigationStore.createIndex('profileId', 'profileId', { unique: false }); // Add 'profileId' index
        } else {
          investigationStore = request.transaction?.objectStore('investigations');
          if (!investigationStore?.indexNames?.contains('profileId')) {
            investigationStore?.createIndex('profileId', 'profileId', { unique: false }); // Ensure 'profileId' index exists
          }
        }

        if (!db.objectStoreNames.contains('prescriptions')) {
          db.createObjectStore('prescriptions', { keyPath: 'id', autoIncrement: true });
        }
        
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
  
      request.onsuccess = (event: any) => {
        resolve(event.target.result);
      };
  
      request.onerror = (event: any) => {
        reject(event.target.error);
      };
    });
  }
}
