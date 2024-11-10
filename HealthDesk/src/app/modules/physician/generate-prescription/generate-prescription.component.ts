import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generate-prescription',
  templateUrl: './generate-prescription.component.html',
  styleUrls: ['./generate-prescription.component.scss']
})
export class GeneratePrescriptionComponent implements OnInit {
  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    enableCheckAll: false,
    disabled:false,
  };
  selectedProfiles: any[] = []; // Array to store selected profiles and their investigations
  customInvestigations: { name: string, value: string }[] = []; // To store custom/free-text investigations
  finalInvestigations: { name: string, value: string }[] = [];
  prescription = {
    gender: 'Male',
    pastHistory: '',
    complaints: [{ text: '', duration: '' }],
    temperature: '',
    pulseRate: '',
    bloodPressure: '',
    respiratoryRate: '',
    systems: [{ name: '', findings: '' }],
    localExamination: '',
    investigations: '',
    rx: [{ dosageForm: '', drugName: '', strength: '', times: '', duration: '', instruction: '' }],
    date: new Date().toISOString().split('T')[0],
    opd:'',
    otherInstructions:'',
    nextFollowUp:''
  };
  patient: any;
  dosageForms = ['Tablet', 'Syrup', 'Injection'];
  drugNames = ['Paracetamol', 'Ibuprofen', 'Amoxicillin'];
  strengths = ['500mg', '250mg', '100mg'];
  times = ['Once a day', 'Twice a day', 'Thrice a day'];
  durations = ['5 days', '7 days', '10 days'];
  headerImage: string | ArrayBuffer | null = null;
  footerImage: string | ArrayBuffer | null = null;
  signature: string | ArrayBuffer | null = null;
  stamp: string | ArrayBuffer | null = null;
  selectedProfile: string = '';
  profiles :any = [];
  investigations: string[] = [];
  currentTabIndex = 0; 

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.patient = navigation?.extras.state?.['patient'] ?? { name: 'John Doe', age: 30, gender: 'Male' };
    this.prescription = navigation?.extras.state?.['prescription'] ?? this.prescription;
  }

  ngOnInit(): void {
    this.loadProfilesFromDB();
  }

  async loadProfilesFromDB(): Promise<void> {
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
        const requestInvestigations = index.getAll(profile.id); // Fetch investigations linked to the profileId
  
        requestInvestigations.onsuccess = () => {
          const investigations = requestInvestigations.result;
          profile.investigations = investigations.map((inv: any) => inv.name); // Store investigation names in the profile
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

  setDefault<T>(event: any, obj: T, key: keyof T) {
    if (event === null || event === undefined || event === '') {
      obj[key] = '' as any;
    }
  }


  addComplaint() {
    this.prescription.complaints.push({ text: '', duration: '' });
  }

  removeComplaint(index: number) {
    this.prescription.complaints.splice(index, 1);
  }

  addSystem() {
    this.prescription.systems.push({ name: '', findings: '' });
  }

  removeSystem(index: number) {
    this.prescription.systems.splice(index, 1);
  }

  addRx() {
    this.prescription.rx.push({ dosageForm: '', drugName: '', strength: '', times: '', duration: '', instruction: '' });
  }

  removeRx(index: number) {
    this.prescription.rx.splice(index, 1);
  }

  async updateInvestigations(selectedProfiles: string[]) {
    this.selectedProfiles = []; // Clear selected profiles array
  
    const db = await this.openIndexedDB();
  
    // We need to use separate transactions here, one for each profile's investigation fetching
    for (const profileName of selectedProfiles) {
      const profileTransaction = db.transaction(['profiles', 'investigations'], 'readonly');
      const profileStore = profileTransaction.objectStore('profiles');
      const investigationStore = profileTransaction.objectStore('investigations');
      
      const profileRequest = profileStore.index('name').get(profileName);
  
      // Fetch profile and its associated investigations in the same transaction scope
      profileRequest.onsuccess = async () => {
        const profile = profileRequest.result;
        if (profile) {
          const index = investigationStore.index('profileId');
          const investigationRequest = index.getAll(profile.id); // Fetch investigations linked to profileId
  
          investigationRequest.onsuccess = () => {
            const investigations = investigationRequest.result.map((inv: any) => ({ name: inv.name, value: '' }));
            this.selectedProfiles.push({
              name: profile.name,
              investigations: investigations
            });
  
            this.updateFinalInvestigations(); // Update final investigations after fetching
          };
  
          investigationRequest.onerror = () => {
            console.error(`Error loading investigations for profile ${profile.name}`);
          };
        }
      };
  
      profileRequest.onerror = () => {
        console.error(`Error loading profile ${profileName}`);
      };
    }
  }
  
  addCustomInvestigation() {
    this.customInvestigations.push({ name: '', value: '' });
    this.updateFinalInvestigations();
  }

  removeCustomInvestigation(index: number) {
    this.customInvestigations.splice(index, 1);
    this.updateFinalInvestigations();
  }

  updateFinalInvestigations() {
    this.finalInvestigations = [];

    // Merge investigations from selected profiles
    for (const profile of this.selectedProfiles) {
      for (const inv of profile.investigations) {
        this.finalInvestigations.push({ name: inv.name, value: inv.value });
      }
    }

    // Add custom investigations
    for (const customInv of this.customInvestigations) {
      this.finalInvestigations.push({ name: customInv.name, value: customInv.value });
    }

    console.log('Final Investigations:', this.finalInvestigations);
  }


  // Update the final investigations when values are changed
  onInvestigationValueChange() {
    this.updateFinalInvestigations();
  }

  nextTab() {
    if (this.currentTabIndex < 3) {
      this.currentTabIndex++;
    }
  }

  previousTab() {
    if (this.currentTabIndex > 0) {
      this.currentTabIndex--;
    }
  }

  formatDate(date: string): string {
    if (!date) {
      return new Date().toISOString().split('T')[0];  // Return today's date if no date is provided
    }
  
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return new Date().toISOString().split('T')[0];  // Return today's date if the provided date is invalid
    }
  
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  async generatePDF() {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const headerHeight = 45;
    const footerHeight = 30;
    const marginBottom = 20;
    let startY = 60;
    const headerImg = new Image();
    const footerImg = new Image();
    const storedHeader = localStorage.getItem('prescription_header_default');
    const storedFooter = localStorage.getItem('prescription_footer_default');

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    const headerImagePromise = storedHeader ? loadImage(storedHeader) : null;
    const footerImagePromise = storedFooter ? loadImage(storedFooter) : null;

    const [headerImage, footerImage] = await Promise.all([headerImagePromise, footerImagePromise]);

    const addHeaderAndFooter = () => {
      // Add header image (fixed position)
      if (headerImage) {
        doc.addImage(headerImage, 'PNG', 10, 10, 190, 30); // Adjust the positioning based on your requirement
      }

      if (footerImage) {
        doc.addImage(footerImage, 'PNG', 10, 260, 190, 30); // Adjust position for footer
      }
      doc.setFontSize(7);
      doc.setFont('calibri');
      doc.setDrawColor(0, 0, 0);  // Set black color
      doc.line(5, headerHeight, 200, headerHeight);  // Separator after header
      startY = 60;
    };


    const checkAndAddNewPage = (tableHeight: number) => {
      if (startY + tableHeight > pageHeight - footerHeight - marginBottom) {
        doc.addPage();
        addHeaderAndFooter();
      }
    };

    addHeaderAndFooter(); // Add header and footer to the first page
    const formattedDate = this.formatDate(this.prescription.date);
    // Add Date on top-right
    doc.text(`Date: ${formattedDate || '_________________'}`, pageWidth - 40, headerHeight + 10);

    // General Details Table (Patient Information, Age, OPD)
    const generalDetails = [
      ['Patient\'s name', this.patient.name || '', 'OPD registration', this.prescription.opd || 'X12ER'],
      ['Age', this.patient.age || '', 'Gender', this.prescription.gender || '']
    ];

    let result = autoTable(doc, {
      startY: startY,
      theme: 'plain',
      styles: {
        font: 'calibri',
        fontSize: 7, lineColor: [0, 0, 0], lineWidth: 0.1, cellPadding: { top: 2, right: 5, bottom: 2, left: 5 }
      },
      columnStyles: {
        0: { cellWidth: 30 },  // Column for 'Patient\'s name', 'Age', 'OPD registration'
        1: { cellWidth: 61 }, // Column for patient name value and OPD value
        2: { cellWidth: 30 },  // Column for 'Gender' (hardcoded text)
        3: { cellWidth: 61 }   // Column for gender value (UI-provided)
      },
      body: generalDetails
    });

    startY = (doc as any).autoTable.previous.finalY + 5;

    const chiefComplaints = this.prescription.complaints?.map((complaint: any, index: number) => [
      index + 1,
      complaint.text,
      complaint.duration
    ]) || [['', '', '']];

    // Approximate table height
    var approxHeight = (chiefComplaints.length * 10) + 7;
    // Check height for Chief Complaints table
    checkAndAddNewPage(approxHeight);
    doc.text('Chief Complaints:', 14, startY);
    startY += 2;

    autoTable(doc, {
      head: [['Sr.', 'Complaint', 'Duration']],
      body: chiefComplaints,
      headStyles: {
        fillColor: [255, 255, 255], // Transparent white header (plain)
        textColor: [0, 0, 0],       // Black text color for header
        fontStyle: 'normal'         // Plain font style
      },
      startY: startY,
      styles: {
        font: 'calibri',
        fontSize: 7, lineColor: [0, 0, 0], lineWidth: 0.1
      }
    });
    startY = (doc as any).autoTable.previous.finalY + 5;


    const vitalsInfo = [
      [`Pulse (per minute): ${this.prescription.pulseRate || ''}`, `Respiratory rate (per minute): ${this.prescription.respiratoryRate || ''}`],
      [`Blood pressure (mm Hg): ${this.prescription.bloodPressure || ''}`, `Temperature: ${this.prescription.temperature || ''}`]
    ];

    // Approximate height for vitals info
    checkAndAddNewPage(27);
    // Vitals Info Table
    doc.text('Vitals:', 14, startY);
    startY += 2;
    autoTable(doc, {
      startY: startY,
      theme: 'plain',
      styles: {
        font: 'calibri',
        fontSize: 7, lineColor: [0, 0, 0], lineWidth: 0.1
      },
      body: vitalsInfo
    });
    startY = (doc as any).autoTable.previous.finalY + 5;

    // Local Examination Table
    const localExamination = [
      [`Local examination`, `${this.prescription.localExamination || ''}`]
    ];
    checkAndAddNewPage(15);
    doc.text('Local Examination:', 14, startY);
    startY += 2;
    // Approximate height
    autoTable(doc, {
      startY: startY,
      theme: 'plain',
      styles: {
        font: 'calibri',
        fontSize: 7, lineColor: [0, 0, 0], lineWidth: 0.1
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 152 }
      },
      body: localExamination
    });

    startY = (doc as any).autoTable.previous.finalY + 5;

    // Systemic Table
    const systemicData = this.prescription.systems?.map((system: any, index: number) => [
      index + 1,
      system.name,
      system.findings
    ]) || [['', '', '']];
    var approxHt = (systemicData.length * 10) + 7;
    checkAndAddNewPage(approxHt);
    doc.text('Physical Examination:', 14, startY);
    startY += 2;
    // Approximate height
    autoTable(doc, {
      head: [['Sr.', 'System', 'Findings']],
      body: systemicData,
      headStyles: {
        fillColor: [255, 255, 255], // Transparent white header (plain)
        textColor: [0, 0, 0],       // Black text color for header
        fontStyle: 'normal'         // Plain font style
      },
      styles: {
        font: 'calibri',
        fontSize: 7, lineColor: [0, 0, 0], lineWidth: 0.1
      },
      startY: startY
    });

    startY = (doc as any).autoTable.previous.finalY + 5;

    // Systemic Table
    const investigations = this.finalInvestigations?.map((fi: any, index: number) => [
      index + 1,
      fi.name,
      fi.value
    ]) || [['', '', '']];
    var approxHt = (investigations.length * 10) + 7;
    checkAndAddNewPage(approxHt);
    doc.text('Investigations:', 14, startY);
    startY += 2;
    // Approximate height
    autoTable(doc, {
      head: [['Sr.', 'Investigation Name', 'Findings']],
      body: systemicData,
      headStyles: {
        fillColor: [255, 255, 255], // Transparent white header (plain)
        textColor: [0, 0, 0],       // Black text color for header
        fontStyle: 'normal'         // Plain font style
      },
      styles: {
        font: 'calibri',
        fontSize: 7, lineColor: [0, 0, 0], lineWidth: 0.1
      },
      startY: startY
    });

    startY = (doc as any).autoTable.previous.finalY + 5;

    // Diagnosis Table
    const diagnosisData = [
      ['Provisional Diagnosis', `${this.prescription.pastHistory || ''}`]
    ];
    checkAndAddNewPage(15);
    // Approximate height
    autoTable(doc, {
      body: diagnosisData,
      styles: {
        font: 'calibri',
        fontSize: 7, lineColor: [0, 0, 0], lineWidth: 0.1
      },
      startY: startY
    });
    startY = (doc as any).autoTable.previous.finalY + 5;
    // Rx Details Table
    const rxData = this.prescription.rx?.map((medication: any, index: number) => [
      index + 1,
      medication.dosageForm,
      medication.drugName,
      medication.strength,
      medication.times,
      medication.duration,
      medication.instruction
    ]) || [['', '', '', '', '', '', '', '']];

    var approx = (rxData.length * 10) + 7;
    checkAndAddNewPage(approx);
    doc.text('Prescription (Rx):', 14, startY);
    startY += 2;
    // Approximate height for Rx details
    autoTable(doc, {
      head: [['Sr.', 'Dosage Form', 'Drug Name', 'Strength', 'Frequency', 'Duration', 'Instruction']],
      headStyles: {
        fillColor: [255, 255, 255], // Transparent white header (plain)
        textColor: [0, 0, 0],       // Black text color for header
        fontStyle: 'normal'         // Plain font style
      },
      body: rxData,
      styles: {
        font: 'calibri',
        fontSize: 7, lineColor: [0, 0, 0], lineWidth: 0.1
      },
      startY: startY
    });
    startY = (doc as any).autoTable.previous.finalY + 5;

    // Other Instructions Table
    const instructionsData = [
      ['Other Instructions', this.prescription.otherInstructions || ''],
      ['Next Follow-up', this.prescription.nextFollowUp || '']
    ];
    checkAndAddNewPage(25);
    // Approximate height
    autoTable(doc, {
      body: instructionsData,
      startY: startY,
      theme: 'plain',
      columnStyles: {
        0: { cellWidth: 30 }, // Hardcoded text
        1: { cellWidth: 152 } // Value from UI
      },
      styles: {
        font: 'calibri',
        fontSize: 7, lineColor: [0, 0, 0], lineWidth: 0.1
      }
    });
    startY = (doc as any).autoTable.previous.finalY + 5;
    checkAndAddNewPage(35);
    // Physician Signature and Stamp Table
    const signatureData = [['Physician Signature', 'Stamp']];
    // Approximate height for signature section
    autoTable(doc, {
      body: signatureData,
      theme: 'plain',
      styles: {
        font: 'calibri',
        fontSize: 7, lineColor: [0, 0, 0], lineWidth: 0.1
      },
      columnStyles: {
        0: { cellWidth: 90 }, // Signature (larger for space)
        1: { cellWidth: 90 }   // Stamp
      },
      didParseCell: (data) => {
        if (data.row.index === 0) {
          data.cell.styles.minCellHeight = 20; // Apply larger row height for signature and stamp
        }
      },
      startY: startY
    });

    const patientId = this.patient.id;

    const prescriptionId = await this.getNextPrescriptionId();
  const pdfName = `${this.patient.name}_${prescriptionId}.pdf`;

  // Concatenate illness from complaints
  const illness = this.prescription.complaints
    .map(complaint => complaint.text)
    .join(', ');

    const pdfOutput = doc.output('blob');
    await this.savePdfToIndexedDB(pdfName, pdfOutput, patientId, prescriptionId, illness);
    await this.updateLastVisitedDate(patientId);
    const pdfUrl = URL.createObjectURL(pdfOutput);
    window.open(pdfUrl, '_blank');
    this.router.navigate(['/physician/patient-record']);
  };

  async savePdfToIndexedDB(pdfName: string, pdfBlob: Blob, patientId: number, prescriptionId: number, illness:string) {
    const db = await this.openIndexedDB();
    const transaction = db.transaction(['pdfs'], 'readwrite');
    const store = transaction.objectStore('pdfs');
    store.put({
      name: pdfName,
      pdfBlob: pdfBlob,
      patientId: patientId,
      prescriptionId: prescriptionId,
      illness: illness,
      date: new Date()
    });
  
    transaction.oncomplete = () => console.log(`PDF stored as ${pdfName}`);
  }
  
  // Retrieve the next prescription ID
  async getNextPrescriptionId(): Promise<number> {
    const db = await this.openIndexedDB();
    const transaction = db.transaction(['pdfs'], 'readonly');
    const store = transaction.objectStore('pdfs');
    const countRequest = store.count();
    
    return new Promise((resolve) => {
      countRequest.onsuccess = () => resolve(countRequest.result + 1);
    });
  }

  async updateLastVisitedDate(patientId: number) {
    const db = await this.openIndexedDB();
    const transaction = db.transaction(['patients'], 'readwrite');
    const store = transaction.objectStore('patients');
    const getRequest = store.get(patientId);
  
    getRequest.onsuccess = () => {
      const patient = getRequest.result;
      patient.lastVisited = new Date().toISOString().split('T')[0];
      store.put(patient);
    };
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
      };
  
      request.onsuccess = (event: any) => {
        resolve(event.target.result);
      };
  
      request.onerror = (event: any) => {
        reject(event.target.error);
      };
    });
  }
  
  navigateToAddProfile() {
    // Store the current prescription in state
    this.router.navigate(['/physician/add-profile'], { state: { prescription: this.prescription, patient:this.patient } });
  }
}
