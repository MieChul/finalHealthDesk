import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-generate-medical-certificate',
  templateUrl: './generate-medical-certificate.component.html',
  styleUrls: ['./generate-medical-certificate.component.scss']
})
export class GenerateMedicalCertificateComponent implements OnInit {
  patientRecord: any;
  diagnosis: string = '';
  treatmentFrom: string = '';
  treatmentTo: string = '';
  daysRest: number | null = null;
  restFromDate: string = '';
  anotherDays: number | null = null;
  fitToResumeFrom: string = '';
  identificationMark: string = '';
  date: string = '';

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.patientRecord = navigation?.extras.state?.['patient'] ?? '';
  }

  ngOnInit(): void {
    // Initialize patientRecord from service or any other source if needed
  }

  resetForm() {
    this.diagnosis = '';
    this.treatmentFrom = '';
    this.treatmentTo = '';
    this.daysRest = null;
    this.restFromDate = '';
    this.anotherDays = null;
    this.fitToResumeFrom = '';
    this.identificationMark = '';
    this.date = '';
  }

  generatePdf() {
    const doc = new jsPDF();
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const underlineText = (text: string) => `___${text}___`;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('MEDICAL CERTIFICATE', pageWidth / 2, 20, { align: 'center' });

    // Place date at the top right below the header
    doc.setFontSize(12);
    doc.text(`Date: ${this.date}`, pageWidth - margin - 50, 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`No.`, margin, 30);
    doc.text(`Patient: `, margin, 40);
    doc.setFont('helvetica', 'bold');
    doc.text(`${underlineText(this.patientRecord.name)}`, margin + 20, 40);

    doc.setFont('helvetica', 'normal');
    doc.text(`Age: `, margin, 50);
    doc.setFont('helvetica', 'bold');
    doc.text(`${underlineText(this.patientRecord.age.toString())} Yrs. Diagnosis: ${underlineText(this.diagnosis)}`, margin + 15, 50);

    doc.setFont('helvetica', 'normal');
    doc.text(`is under my treatment as an out-patient and/or in-patient, at this clinic.`, margin, 60);

    doc.text(`Was treated as an O.P.D. Patient from: `, margin, 70);
    doc.setFont('helvetica', 'bold');
    doc.text(`${underlineText(this.treatmentFrom)} to ${underlineText(this.treatmentTo)}.`, margin + 70, 70);

    doc.setFont('helvetica', 'normal');
    doc.text(`He/She has been advised `, margin, 80);
    doc.setFont('helvetica', 'bold');
    doc.text(`${underlineText(this.daysRest?.toString()??'')} days rest from ${underlineText(this.treatmentFrom)} to ${underlineText(this.treatmentTo)}.`, margin + 55, 80);

    doc.setFont('helvetica', 'normal');
    doc.text(`However, He/She is further advised to continue rest from `, margin, 90);
    doc.setFont('helvetica', 'bold');
    doc.text(`${underlineText(this.restFromDate)} for another ${underlineText(this.anotherDays?.toString()??'')} days.`, margin + 100, 90);

    doc.setFont('helvetica', 'normal');
    doc.text(`He/She is fit to resume normal duties / light work from `, margin, 100);
    doc.setFont('helvetica', 'bold');
    doc.text(`${underlineText(this.fitToResumeFrom)}.`, margin + 100, 100);

    doc.setFont('helvetica', 'normal');
    doc.text(`Indentification Mark: `, margin, 110);
    doc.setFont('helvetica', 'bold');
    doc.text(`${underlineText(this.identificationMark)}.`, margin + 50, 110);

    // Signature and stamp boxes
    doc.setLineWidth(0.5);
    doc.rect(margin, 130, pageWidth / 2 - margin * 2, 30); // Patient's Signature
    doc.rect(pageWidth / 2 + margin, 130, pageWidth / 2 - margin * 2, 30); // Doctor's Signature
    doc.text(`Patient's Signature`, margin + 2, 140);
    doc.text(`Doctor's Signature`, pageWidth / 2 + margin + 2, 140);

    // Add header and footer images
    const headerImg = 'assets/prescription_header.jpg';
    const footerImg = 'assets/prescription_footer.png';

    if (headerImg) {
      doc.addImage(headerImg, 'JPEG', margin, 10, pageWidth - 2 * margin, 20);
    }

    if (footerImg) {
      doc.addImage(footerImg, 'PNG', margin, doc.internal.pageSize.getHeight() - 40, pageWidth - 2 * margin, 20);
    }

    const pdfUrl = doc.output('bloburl');
    window.open(pdfUrl, '_blank');
  }
}
