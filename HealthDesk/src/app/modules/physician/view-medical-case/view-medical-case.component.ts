import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Modal } from 'bootstrap'; // Import Bootstrap modal

@Component({
  selector: 'app-view-medical-case',
  templateUrl: './view-medical-case.component.html',
  styleUrls: ['./view-medical-case.component.scss']
})
export class ViewMedicalCaseComponent implements OnInit {
  caseDetails: any = {
    speciality: 'Cardiology',
    diagnosis: 'Myocardial Infarction',
    patientInitials: 'JD',
    age: 65,
    chiefComplaints: 'Severe chest pain',
    pastHistory: 'Hypertension, Diabetes',
    examination: 'Patient is conscious, BP 140/90 mmHg',
    investigation: 'ECG shows ST elevation, Troponin I positive',
    treatment: 'Aspirin, Nitroglycerin, Heparin',
    caseSummary: 'Patient was admitted with severe chest pain and diagnosed with myocardial infarction. Treated with Aspirin, Nitroglycerin, and Heparin.',
    likeCount: 10 // Initial like count
  };

  shareLink: string = ''; // Store the shareable link
  @ViewChild('shareModal') shareModal!: ElementRef;

  caseDetailSections = [
    { title: 'Patient Initials', content: this.caseDetails.patientInitials },
    { title: 'Age (years)', content: this.caseDetails.age },
    { title: 'Chief Complaints', content: this.caseDetails.chiefComplaints },
    { title: 'Past History', content: this.caseDetails.pastHistory },
    { title: 'Examination', content: this.caseDetails.examination },
    { title: 'Investigation', content: this.caseDetails.investigation },
    { title: 'Treatment', content: this.caseDetails.treatment },
    { title: 'Case Summary', content: this.caseDetails.caseSummary }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const caseId = this.route.snapshot.paramMap.get('id');
    // Fetch case details using caseId if needed
    this.shareLink = `https://HealthDesk.com/physician/view-medical/${caseId}`; // Example link
  }

  // Go back to the previous page (Medical Cases)
  goBack() {
    this.router.navigate(['/physician/medical-cases']);
  }

  // Increment like count
  likeCase() {
    this.caseDetails.likeCount++;
    console.log('Liked the case! New like count:', this.caseDetails.likeCount);
  }

  // Open the share modal
  openShareModal() {
    const modalInstance = new Modal(this.shareModal.nativeElement);
    modalInstance.show();
  }
}
