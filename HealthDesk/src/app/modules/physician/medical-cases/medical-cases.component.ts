import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Modal } from 'bootstrap';

interface MedicalCase {
  id: number;
  submittedBy: string;
  speciality: string;
  comments: string[];
  likeCount: number;
  shareCount: number;
  shortDescription: string;
}

@Component({
  selector: 'app-medical-cases',
  templateUrl: './medical-cases.component.html',
  styleUrls: ['./medical-cases.component.scss']
})
export class MedicalCasesComponent implements OnInit {
  @ViewChild('commentsModal') commentsModal!: ElementRef;
  @ViewChild('shareModal') shareModal!: ElementRef;

  shareLink: string = '';
  comments: string[] = [];
  newComment: { [key: number]: string } = {};
  otherCases: MedicalCase[] = [
    { id: 1, submittedBy: 'Dr. Smith', speciality: 'Cardiology', comments: ['Great case!'], likeCount: 10, shareCount: 5, shortDescription: 'A detailed case study on cardiology' },
    { id: 2, submittedBy: 'Dr. Johnson', speciality: 'Neurology', comments: [], likeCount: 7, shareCount: 2, shortDescription: 'An intriguing neurology case' },
    { id: 3, submittedBy: 'Dr. Lee', speciality: 'Orthopedics', comments: [], likeCount: 15, shareCount: 3, shortDescription: 'Orthopedics case study and analysis' },
    { id: 4, submittedBy: 'Dr. Brown', speciality: 'Dermatology', comments: [], likeCount: 8, shareCount: 4, shortDescription: 'Dermatology case with treatment details' },
    { id: 5, submittedBy: 'Dr. Taylor', speciality: 'Pediatrics', comments: [], likeCount: 12, shareCount: 6, shortDescription: 'A pediatric case involving rare symptoms' },
  ];

  yourCases: MedicalCase[] = [
    { id: 1, submittedBy: 'You', speciality: 'Cardiology', comments: [], likeCount: 0, shareCount: 0, shortDescription: 'Your own case study on cardiology' },
    { id: 2, submittedBy: 'You', speciality: 'Neurology', comments: [], likeCount: 0, shareCount: 0, shortDescription: 'Your own case study on neurology' },
    { id: 3, submittedBy: 'You', speciality: 'Orthopedics', comments: [], likeCount: 0, shareCount: 0, shortDescription: 'Your own case study on orthopedics' },
  ];

  constructor(private router: Router, private modalService: NgbModal) {}

  ngOnInit(): void {}

  viewCase(caseId: number) {
    this.router.navigate(['/physician/view-medical-case', caseId]);
  }

  createNewCase() {
    this.router.navigate(['/physician/new-medical-case']);
  }

  addComment(caseId: number) {
    const caseIndex = this.otherCases.findIndex(c => c.id === caseId);
    if (caseIndex !== -1 && this.newComment[caseId]) {
      this.otherCases[caseIndex].comments.push(this.newComment[caseId]);
      this.newComment[caseId] = '';
    }
  }

  likeCase(caseId: number) {
    const caseIndex = this.otherCases.findIndex(c => c.id === caseId);
    if (caseIndex !== -1) {
      this.otherCases[caseIndex].likeCount++;
    }
  }

  viewComments(caseId: number) {
    const caseIndex = this.otherCases.findIndex(c => c.id === caseId);
    if (caseIndex !== -1) {
      this.comments = this.otherCases[caseIndex].comments;
      const commentsModalInstance = new Modal(this.commentsModal.nativeElement);
      commentsModalInstance.show();
    }
  }

  shareCase(caseId: number) {
    this.shareLink = `https://HealthDesk.com/physician/view-medical/${caseId}`;
    const shareModalInstance = new Modal(this.shareModal.nativeElement);
    shareModalInstance.show();
  }
}
