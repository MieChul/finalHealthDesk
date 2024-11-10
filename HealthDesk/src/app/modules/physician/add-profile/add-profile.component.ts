import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-profile',
  templateUrl: './add-profile.component.html',
  styleUrls: ['./add-profile.component.scss']
})
export class AddProfileComponent {
  profiles: { id: string, name: string; investigations: { id: string, profileId: string, name: string }[] }[] = [];
  prescription: any;
  patient: any;
  constructor(private route: ActivatedRoute, private router: Router) {

 
  }

  async ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    this.prescription = navigation?.extras.state?.['prescription'] ?? null; // R
    this.patient = navigation?.extras.state?.['patient'] ?? null; // R
    // Load profiles from IndexedDB on component load
    await this.loadProfiles();
  }

  addNewProfile() {
    this.profiles.push({ id: '', name: '', investigations: [{ id: '', profileId: '', name: '' }] });
  }

  addInvestigation(profileIndex: number) {
    this.profiles[profileIndex].investigations.push({ id: '', profileId: '', name: '' });
  }

  async removeInvestigation(profileIndex: number, investigationIndex: number) {
    const investigation = this.profiles[profileIndex].investigations[investigationIndex];

    if (investigation.id) { // Check if investigation has an ID
      // Remove from IndexedDB
      const db = await this.openIndexedDB();
      const transaction = db.transaction(['investigations'], 'readwrite');
      const store = transaction.objectStore('investigations');
      const deleteRequest = store.delete(investigation.id); // Delete by ID

      deleteRequest.onsuccess = () => {
        console.log(`Investigation with ID ${investigation.id} removed from IndexedDB.`);
      };

      deleteRequest.onerror = () => {
        console.error(`Error removing investigation with ID ${investigation.id} from IndexedDB.`);
      };
    }

    // Remove from the array
    this.profiles[profileIndex].investigations.splice(investigationIndex, 1);
  }


  async removeProfile(profileIndex: number) {
    const profile = this.profiles[profileIndex];

    if (profile.id) { // Check if profile has an ID
      // Remove from IndexedDB
      const db = await this.openIndexedDB();
      const transaction = db.transaction(['profiles', 'investigations'], 'readwrite');

      const profileStore = transaction.objectStore('profiles');
      const investigationStore = transaction.objectStore('investigations');

      // First, delete the profile
      const deleteProfileRequest = profileStore.delete(profile.id);

      deleteProfileRequest.onsuccess = () => {
        console.log(`Profile with ID ${profile.id} removed from IndexedDB.`);
      };

      deleteProfileRequest.onerror = () => {
        console.error(`Error removing profile with ID ${profile.id} from IndexedDB.`);
      };

      // Then, delete all associated investigations
      const index = investigationStore.index('profileId');
      const deleteInvestigationsRequest = index.openCursor(IDBKeyRange.only(profile.id));

      deleteInvestigationsRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          investigationStore.delete(cursor.primaryKey);
          cursor.continue();
        }
      };

      deleteInvestigationsRequest.onerror = () => {
        console.error(`Error removing investigations for profile ID ${profile.id} from IndexedDB.`);
      };
    }

    // Remove from the array
    this.profiles.splice(profileIndex, 1);
  }

  async saveProfiles() {
    await this.saveProfilesToDB();
    this.router.navigate(['/physician/generate-prescription']);
  }

  async saveProfilesToDB() {
    const db = await this.openIndexedDB();
    const transaction = db.transaction(['profiles', 'investigations'], 'readwrite');
    const profileStore = transaction.objectStore('profiles');
    const investigationStore = transaction.objectStore('investigations');
  
    for (const profile of this.profiles) {
      // Check if the profile exists (has an ID)
      let profileId = profile.id ? profile.id : await this.getNextProfileId(profileStore);
  
      // Check if the profile exists in the store
      const existingProfile = await this.getExistingRecord(profileStore, profileId);
  
      // If it exists, we update, else we insert a new record
      if (existingProfile) {
        profileStore.put({ id: profileId, name: profile.name });
      } else {
        profileId = await this.getNextProfileId(profileStore); // Get new ID only for inserts
        profileStore.put({ id: profileId, name: profile.name });
      }
  
      // Loop through the investigations
      for (const investigation of profile.investigations) {
        // Check if the investigation exists (has an ID)
        let investigationId = investigation.id ? investigation.id : await this.getNextInvestigationId(investigationStore);
  
        // Check if the investigation exists in the store
        const existingInvestigation = await this.getExistingRecord(investigationStore, investigationId);
  
        // If it exists, we update, else we insert a new record
        if (existingInvestigation) {
          investigationStore.put({ id: investigationId, name: investigation.name, profileId: profileId });
        } else {
          investigationId = await this.getNextInvestigationId(investigationStore); // Get new ID only for inserts
          investigationStore.put({ id: investigationId, name: investigation.name, profileId: profileId });
        }
      }
    }
  
    transaction.oncomplete = () => console.log('Profiles and investigations saved/updated in IndexedDB');
  }

  async getExistingRecord(store: IDBObjectStore, id: string | number): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = store.get(id);
  
      request.onsuccess = (event: any) => {
        resolve(event.target.result);
      };
  
      request.onerror = () => {
        reject(null);
      };
    });
  }
  
  

  async loadProfiles(): Promise<void> {
    const db = await this.openIndexedDB();
    const transaction = db.transaction(['profiles', 'investigations'], 'readonly');
    const profileStore = transaction.objectStore('profiles');
    const investigationStore = transaction.objectStore('investigations');
    const requestProfiles = profileStore.getAll(); // Fetch all profiles

    requestProfiles.onsuccess = async () => {
      const result = requestProfiles.result;
      this.profiles = result ? result : []; // Set the profiles array from IndexedDB result

      // Now load investigations for each profile
      for (const profile of this.profiles) {
        const index = investigationStore.index('profileId');
        const requestInvestigations = index.getAll(profile?.id ?? 0); // Fetch investigations linked to the profileId

        requestInvestigations.onsuccess = () => {
          const investigations = requestInvestigations.result;
          profile.investigations = investigations; // Store investigation names in the profile
        };

        requestInvestigations.onerror = () => {
          console.error(`Error loading investigations for profile ${profile.name}`);
        };
      }
    };

    requestProfiles.onerror = () => {
      console.error('Error loading profiles from IndexedDB');
    };
  }

  openIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('prescriptionsDB', 2);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('profiles')) {
          db.createObjectStore('profiles', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('investigations')) {
          const store = db.createObjectStore('investigations', { keyPath: 'id', autoIncrement: true });
          store.createIndex('profileId', 'profileId');
        }
      };

      request.onsuccess = (event: any) => resolve(event.target.result);
      request.onerror = (event: any) => reject(event.target.error);
    });
  }

  async getNextProfileId(store: IDBObjectStore): Promise<number> {
    const countRequest = store.count();
    return new Promise((resolve) => {
      countRequest.onsuccess = () => resolve(countRequest.result + 1);
    });
  }

  async getNextInvestigationId(store: IDBObjectStore): Promise<number> {
    const countRequest = store.count();
    return new Promise((resolve) => {
      countRequest.onsuccess = () => resolve(countRequest.result + 1);
    });
  }

  navigateBackToPrescription() {
    // Ensure we pass back the prescription to retain entered data
    this.router.navigate(['/physician/generate-prescription'], { state: { prescription: this.prescription, patient: this.patient } });
  }
}