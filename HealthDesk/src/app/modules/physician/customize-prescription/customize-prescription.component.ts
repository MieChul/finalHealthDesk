import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Router } from '@angular/router';
import { Tooltip } from 'bootstrap';

@Component({
  selector: 'app-customize-prescription',
  templateUrl: './customize-prescription.component.html',
  styleUrls: ['./customize-prescription.component.scss']
})
export class CustomizePrescriptionComponent implements OnInit {
  selectedTemplate: number = 0;
  isEditMode: boolean = false; // Flag to check if it's editing
  prescriptionId: number | null = null;

  clinicName = '';
  clinicAddress = '';
  clinicPhone = '9930506961';
  mrcNumber = '14356';
  physicianName = 'Dr. Rao';
  physicianQualification = 'MBBS, MD';
  qualification = 'MBBS, MD';
  clinicTimings = '';
  clinics: string[] = ['Clinic A', 'Clinic B', 'Clinic C'];
  footerText = '';
  templateName = '';

  // Separate style properties for each field
  clinicNameFontType = 'Arial';
  clinicNameFontSize = 'medium';
  clinicNameFontColor = '#000000';

  clinicAddressFontType = 'Arial';
  clinicAddressFontSize = 'medium';
  clinicAddressFontColor = '#000000';

  clinicPhoneFontType = 'Arial';
  clinicPhoneFontSize = 'medium';
  clinicPhoneFontColor = '#000000';

  physicianNameFontType = 'Arial';
  physicianNameFontSize = 'medium';
  physicianNameFontColor = '#000000';

  clinicTimingsFontType = 'Arial';
  clinicTimingsFontSize = 'medium';
  clinicTimingsFontColor = '#000000';

  mrcNumberFontType = 'Arial';
  mrcNumberFontSize = 'medium';
  mrcNumberFontColor = '#000000';

  qualificationFontType = 'Arial';
  qualificationFontSize = 'medium';
  qualificationFontColor = '#000000';

  footerTextFontType = 'Arial';
  footerTextFontSize = 'medium';
  footerTextFontColor = '#000000';

  logoImage: string | ArrayBuffer | null = null;
  isDefault = false;

  fonts = ['Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana'];

  constructor(private route: ActivatedRoute, private router: Router) { }
  ngAfterViewInit() {
    // Initialize the Bootstrap tooltip
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => new Tooltip(tooltipTriggerEl));
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        // If 'id' is present, we're in edit mode
        this.prescriptionId = +params['id'];
        this.isEditMode = true;
        this.loadPrescription(this.prescriptionId); // Load prescription details for editing
      } else if (params['templateId']) {
        // If 'templateId' is present, we're selecting a template for new prescription
        this.selectedTemplate = +params['templateId'];
        this.isEditMode = false; // New mode, not editing
      }
    });
  }


  onFileChange(event: any, type: string) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (type === 'logo') {
        this.logoImage = reader.result;

        // Save the logo as 'logo_prescription.png' in localStorage
        if (this.logoImage) {
          localStorage.setItem('logo_prescription', this.logoImage as string);
        }
      }
    };

    reader.readAsDataURL(file);
  }

  triggerFileInput(elementId: string) {
    document.getElementById(elementId)?.click();
  }

  getFontSize(size: string): number {
    switch (size) {
      case 'small':
        return 10;
      case 'medium':
        return 15;
      case 'large':
        return 20;
      default:
        return 15;
    }
  }

  async previewHeader() {
    const canvasHeader = document.createElement('canvas');
    const canvasFooter = document.createElement('canvas');

    // Set dimensions for both header and footer
    canvasHeader.width = 750;
    canvasHeader.height = 200;
    canvasFooter.width = 750;
    canvasFooter.height = 200;

    const ctxHeader = canvasHeader.getContext('2d');
    const ctxFooter = canvasFooter.getContext('2d');

    if (ctxHeader && ctxFooter) {
      // Clear canvases
      ctxHeader.clearRect(0, 0, canvasHeader.width, canvasHeader.height);
      ctxFooter.clearRect(0, 0, canvasFooter.width, canvasFooter.height);

      // Draw the header content based on the selected template type
      await this.drawHeaderTemplate(ctxHeader, this.selectedTemplate);
      await this.saveCanvasAsImageHeader(canvasHeader, 'prescription_header.png');
      await this.drawFooterTemplate(ctxFooter, this.footerText);
      await this.saveCanvasAsImageFooter(canvasFooter, 'prescription_footer.png');
      await this.generatePDF({});
    }
  }

  async drawFooterTemplate(ctx: CanvasRenderingContext2D, footerText: string) {
    ctx.font = `${this.getFontSize(this.footerTextFontSize)}px ${this.footerTextFontType}`;
    ctx.fillStyle = this.footerTextFontColor;

    // Calculate the center alignment for the footerText
    const footerTextWidth = ctx.measureText(footerText).width;
    const footerTextX = (750 - footerTextWidth) / 2;  // Assuming canvas width is 750px

    // Draw the footerText centered horizontally
    ctx.fillText(footerText, footerTextX, 100);  // Centered at y = 100
  }
  async drawHeaderTemplate(ctx: CanvasRenderingContext2D, templateType: number) {
    ctx.fillStyle = '#FFFFFF';
    // Template based on the selected type
    switch (this.selectedTemplate) {
      case 1: // Template 1: Left (Logo), Center (Clinic Details), Right (Physician Details)
        const promises: Promise<void>[] = [];
        const storedLogo = localStorage.getItem('logo_prescription');
        if (storedLogo) {

          promises.push(new Promise<void>((resolve) => {

            const logoImg = new Image();
            logoImg.src = storedLogo;
            logoImg.onload = () => {

              ctx.drawImage(logoImg, 10, 20, 120, 100);

              resolve();

            };

            logoImg.onerror = () => {

              resolve();

            };

          }));

        }
        await Promise.all(promises);
        // Center Section: Clinic Details
        ctx.font = `${this.getFontSize(this.clinicNameFontSize)}px ${this.clinicNameFontType}`;
        ctx.fillStyle = this.clinicNameFontColor;
        ctx.fillText(this.clinicName, 300, 40);
        ctx.font = `${this.getFontSize(this.clinicAddressFontSize)}px ${this.clinicAddressFontType}`;
        ctx.fillStyle = this.clinicAddressFontColor;
        ctx.fillText(this.clinicAddress, 300, 70);
        ctx.font = `${this.getFontSize(this.clinicPhoneFontSize)}px ${this.clinicPhoneFontType}`;
        ctx.fillStyle = this.clinicPhoneFontColor;
        ctx.fillText(`Phone: ${this.clinicPhone}`, 300, 100);
        ctx.font = `${this.getFontSize(this.clinicTimingsFontSize)}px ${this.clinicTimingsFontType}`;
        ctx.fillStyle = this.clinicTimingsFontColor;
        ctx.fillText(`Timings: ${this.clinicTimings}`, 300, 130);

        // Right Section: Physician Details
        ctx.font = `${this.getFontSize(this.physicianNameFontSize)}px ${this.physicianNameFontType}`;
        ctx.fillStyle = this.physicianNameFontColor;
        ctx.fillText(this.physicianName, 600, 40);
        ctx.font = `${this.getFontSize(this.qualificationFontSize)}px ${this.qualificationFontType}`;
        ctx.fillStyle = this.qualificationFontColor;
        ctx.fillText(this.physicianQualification, 600, 70);
        ctx.font = `${this.getFontSize(this.mrcNumberFontSize)}px ${this.mrcNumberFontType}`;
        ctx.fillStyle = this.mrcNumberFontColor;
        ctx.fillText(`MRC: ${this.mrcNumber}`, 600, 100);
        break;

      case 2:
        // Left Section: Logo
        const promises2: Promise<void>[] = [];
        const storedLogo2 = localStorage.getItem('logo_prescription');
        if (storedLogo2) {

          promises2.push(new Promise<void>((resolve) => {

            const logoImg = new Image();
            logoImg.src = storedLogo2;
            logoImg.onload = () => {

              ctx.drawImage(logoImg, 300, 20, 120, 100);

              resolve();

            };

            logoImg.onerror = () => {

              resolve();

            };

          }));

        }
        await Promise.all(promises2);
        // Center Section: Clinic Details
        ctx.font = `${this.getFontSize(this.clinicNameFontSize)}px ${this.clinicNameFontType}`;
        ctx.fillStyle = this.clinicNameFontColor;
        ctx.fillText(this.clinicName, 10, 40);
        ctx.font = `${this.getFontSize(this.clinicAddressFontSize)}px ${this.clinicAddressFontType}`;
        ctx.fillStyle = this.clinicAddressFontColor;
        ctx.fillText(this.clinicAddress, 10, 70);
        ctx.font = `${this.getFontSize(this.clinicPhoneFontSize)}px ${this.clinicPhoneFontType}`;
        ctx.fillStyle = this.clinicPhoneFontColor;
        ctx.fillText(`Phone: ${this.clinicPhone}`, 10, 100);
        ctx.font = `${this.getFontSize(this.clinicTimingsFontSize)}px ${this.clinicTimingsFontType}`;
        ctx.fillStyle = this.clinicTimingsFontColor;
        ctx.fillText(`Timings: ${this.clinicTimings}`, 10, 130);

        // Right Section: Physician Details
        ctx.font = `${this.getFontSize(this.physicianNameFontSize)}px ${this.physicianNameFontType}`;
        ctx.fillStyle = this.physicianNameFontColor;
        ctx.fillText(this.physicianName, 600, 40);
        ctx.font = `${this.getFontSize(this.qualificationFontSize)}px ${this.qualificationFontType}`;
        ctx.fillStyle = this.qualificationFontColor;
        ctx.fillText(this.physicianQualification, 600, 70);
        ctx.font = `${this.getFontSize(this.mrcNumberFontSize)}px ${this.mrcNumberFontType}`;
        ctx.fillStyle = this.mrcNumberFontColor;
        ctx.fillText(`MRC: ${this.mrcNumber}`, 600, 100);
        break;
      case 3:
        // Left Section: Logo
        const promises3: Promise<void>[] = [];
        const storedLogo3 = localStorage.getItem('logo_prescription');
        if (storedLogo3) {

          promises3.push(new Promise<void>((resolve) => {

            const logoImg = new Image();
            logoImg.src = storedLogo3;
            logoImg.onload = () => {

              ctx.drawImage(logoImg, 600, 20, 120, 100);

              resolve();

            };

            logoImg.onerror = () => {

              resolve();

            };


          }));

        }
        await Promise.all(promises3);
        // Center Section: Clinic Details
        ctx.font = `${this.getFontSize(this.clinicNameFontSize)}px ${this.clinicNameFontType}`;
        ctx.fillStyle = this.clinicNameFontColor;
        ctx.fillText(this.clinicName, 10, 40);
        ctx.font = `${this.getFontSize(this.clinicAddressFontSize)}px ${this.clinicAddressFontType}`;
        ctx.fillStyle = this.clinicAddressFontColor;
        ctx.fillText(this.clinicAddress, 10, 70);
        ctx.font = `${this.getFontSize(this.clinicPhoneFontSize)}px ${this.clinicPhoneFontType}`;
        ctx.fillStyle = this.clinicPhoneFontColor;
        ctx.fillText(`Phone: ${this.clinicPhone}`, 10, 100);
        ctx.font = `${this.getFontSize(this.clinicTimingsFontSize)}px ${this.clinicTimingsFontType}`;
        ctx.fillStyle = this.clinicTimingsFontColor;
        ctx.fillText(`Timings: ${this.clinicTimings}`, 10, 130);

        // Right Section: Physician Details
        ctx.font = `${this.getFontSize(this.physicianNameFontSize)}px ${this.physicianNameFontType}`;
        ctx.fillStyle = this.physicianNameFontColor;
        ctx.fillText(this.physicianName, 400, 40);
        ctx.font = `${this.getFontSize(this.qualificationFontSize)}px ${this.qualificationFontType}`;
        ctx.fillStyle = this.qualificationFontColor;
        ctx.fillText(this.physicianQualification, 400, 70);
        ctx.font = `${this.getFontSize(this.mrcNumberFontSize)}px ${this.mrcNumberFontType}`;
        ctx.fillStyle = this.mrcNumberFontColor;
        ctx.fillText(`MRC: ${this.mrcNumber}`, 400, 100);
        break;

      case 4:


        const promises4: Promise<void>[] = [];
        const storedLogo4 = localStorage.getItem('logo_prescription');
        if (storedLogo4) {

          promises4.push(new Promise<void>((resolve) => {

            const logoImg = new Image();
            logoImg.src = storedLogo4;
            logoImg.onload = () => {

              ctx.drawImage(logoImg, 0, 0, 750, 50);

              resolve();

            };

            logoImg.onerror = () => {

              resolve();

            };

            logoImg.src = this.logoImage as string;

          }));

        }
        await Promise.all(promises4);
        // Left Section: Clinic Details
        ctx.font = `${this.getFontSize(this.clinicNameFontSize)}px ${this.clinicNameFontType}`;
        ctx.fillStyle = this.clinicNameFontColor;
        ctx.fillText(this.clinicName, 10, 100);  // Adjusted for bottom placement after logo
        ctx.font = `${this.getFontSize(this.clinicAddressFontSize)}px ${this.clinicAddressFontType}`;
        ctx.fillStyle = this.clinicAddressFontColor;
        ctx.fillText(this.clinicAddress, 10, 130);  // Adjusted for bottom placement after logo
        ctx.font = `${this.getFontSize(this.clinicPhoneFontSize)}px ${this.clinicPhoneFontType}`;
        ctx.fillStyle = this.clinicPhoneFontColor;
        ctx.fillText(`Phone: ${this.clinicPhone}`, 10, 160);  // Adjusted for bottom placement after logo
        ctx.font = `${this.getFontSize(this.clinicTimingsFontSize)}px ${this.clinicTimingsFontType}`;
        ctx.fillStyle = this.clinicTimingsFontColor;
        ctx.fillText(`Timings: ${this.clinicTimings}`, 10, 190);  // Adjusted for bottom placement after logo

        // Right Section: Physician Details
        ctx.font = `${this.getFontSize(this.physicianNameFontSize)}px ${this.physicianNameFontType}`;
        ctx.fillStyle = this.physicianNameFontColor;
        ctx.fillText(this.physicianName, 500, 100);  // Adjusted for right alignment at the bottom
        ctx.font = `${this.getFontSize(this.qualificationFontSize)}px ${this.qualificationFontType}`;
        ctx.fillStyle = this.qualificationFontColor;
        ctx.fillText(this.physicianQualification, 500, 130);  // Adjusted for right alignment at the bottom
        ctx.font = `${this.getFontSize(this.mrcNumberFontSize)}px ${this.mrcNumberFontType}`;
        ctx.fillStyle = this.mrcNumberFontColor;
        ctx.fillText(`MRC: ${this.mrcNumber}`, 500, 160);  // Adjusted for right alignment at the bottom
        break;

      default:
        console.error('Invalid template type');
    }
  }

  async saveCanvasAsImageHeader(canvas: HTMLCanvasElement, filename: string) {
    const dataUrl = canvas.toDataURL('image/png');
    localStorage.setItem('prescription_header', dataUrl);

  }

  async saveCanvasAsImageFooter(canvas: HTMLCanvasElement, filename: string) {
    const dataUrl = canvas.toDataURL('image/png');
    localStorage.setItem('prescription_footer', dataUrl);

  }





  async generatePDF(patientData: any) {
    if (!this.templateName) {
      alert('Template Name is required.');
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const headerHeight = 45;
    const footerHeight = 30;
    const marginBottom = 20;
    let startY = 60;
    const headerImg = new Image();
    const footerImg = new Image();
    const storedHeader = localStorage.getItem('prescription_header');
    const storedFooter = localStorage.getItem('prescription_footer');

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

    // Add Date on top-right
    doc.text(`Date: ${patientData.date || '_________________'}`, pageWidth - 40, headerHeight + 10);

    // General Details Table (Patient Information, Age, OPD)
    const generalDetails = [
      ['Patient\'s name', patientData.name || '', 'OPD registration', patientData.opd || ''],
      ['Age', patientData.age || '', 'Gender', patientData.gender || '']
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

    // Chief Complaints Table
    checkAndAddNewPage(30);
    doc.text('Chief Complaints:', 14, startY);
    startY += 2;

    const chiefComplaints = patientData.complaints?.map((complaint: any, index: number) => [
      index + 1,
      complaint.text,
      complaint.duration
    ]) || [['', '', '']];

    // Check height for Chief Complaints table
    // Approximate table height
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
    checkAndAddNewPage(30);
    // Vitals Info Table
    doc.text('Vitals:', 14, startY);
    startY += 2;
    const vitalsInfo = [
      [`Pulse (per minute): ${patientData.pulse || ''}`, `Respiratory rate (per minute): ${patientData.respiratoryRate || ''}`],
      [`Blood pressure (mm Hg): ${patientData.bp || ''}`, `Temperature: ${patientData.temperature || ''}`]
    ];

    // Approximate height for vitals info
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
    checkAndAddNewPage(30);
    // Local Examination Table
    const localExamination = [
      [`Local examination`, `${patientData.localExamination || ''}`]
    ];

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
    checkAndAddNewPage(30);
    // Systemic Table
    const systemicData = patientData.systemic?.map((system: any, index: number) => [
      index + 1,
      system.name,
      system.findings
    ]) || [['', '', '']];

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
    checkAndAddNewPage(30);
    // Diagnosis Table
    const diagnosisData = patientData.diagnosis?.map((diag: any, index: number) => [
      index + 1,
      diag.provisionalDiagnosis,
      diag.investigations
    ]) || [['', '', '']];

    doc.text('Diagnosis:', 14, startY);
    startY += 2;
    // Approximate height
    autoTable(doc, {
      head: [['Sr.', 'Provisional Diagnosis', 'Investigations']],
      headStyles: {
        fillColor: [255, 255, 255], // Transparent white header (plain)
        textColor: [0, 0, 0],       // Black text color for header
        fontStyle: 'normal'         // Plain font style
      },
      body: diagnosisData,
      styles: {
        font: 'calibri',
        fontSize: 7, lineColor: [0, 0, 0], lineWidth: 0.1
      },
      startY: startY
    });
    startY = (doc as any).autoTable.previous.finalY + 5;
    checkAndAddNewPage(40);
    // Rx Details Table
    const rxData = patientData.rx?.map((medication: any, index: number) => [
      index + 1,
      medication.dosageForm,
      medication.drugName,
      medication.strength,
      medication.route,
      medication.frequency,
      medication.duration,
      medication.instruction
    ]) || [['', '', '', '', '', '', '', '']];

    doc.text('Rx Details:', 14, startY);
    startY += 2;
    // Approximate height for Rx details
    autoTable(doc, {
      head: [['Sr.', 'Dosage Form', 'Drug Name', 'Strength', 'Route', 'Frequency', 'Duration', 'Instruction']],
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
    checkAndAddNewPage(30);
    // Other Instructions Table
    const instructionsData = [
      ['Other Instructions', patientData.otherInstructions || ''],
      ['Next Follow-up', patientData.nextFollowUp || '']
    ];

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
    checkAndAddNewPage(30);
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

    startY = (doc as any).autoTable.previous.finalY + 5;
    doc.setDrawColor(0, 0, 0);  // Set black color
    doc.line(5, startY, 200, startY);  // Draw horizontal line
    // Save PDF
    const pdfOutput = doc.output('blob'); // Get PDF as Blob
    const tempFileName = `temp_${this.templateName}_template${this.selectedTemplate}.pdf`;
    await this.savePdfToIndexedDB(tempFileName, pdfOutput);
    const pdfUrl = URL.createObjectURL(pdfOutput);
    window.open(pdfUrl);
  };


  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob); // Read the blob as data URL (base64)
    });
  }

  async saveTemplate() {
    if (!this.templateName) {
      alert('Template Name is required.');
      return;
    }

    // Fetch existing prescriptions from IndexedDB
    const storedPrescriptions = await this.getAllPrescriptions();

    // Check if a prescription with the same name already exists
    const existingTemplate = storedPrescriptions.find(
      (p: any) => p.name.toLowerCase() === this.templateName.toLowerCase()
    );

    if (existingTemplate && !this.isEditMode) {
      alert('A template with this name already exists. Please choose a different name.');
      return;
    }

    // If the current template is marked as default, unmark all other templates
    if (this.isDefault) {
      const header =  localStorage.getItem('prescription_header');
      const footer =  localStorage.getItem('prescription_footer');

      localStorage.setItem('prescription_header_default', header?? '');
      localStorage.setItem('prescription_footer_default', footer??'');
      storedPrescriptions.forEach((template: any) => {
        template.isDefault = false; // Unmark all other templates
      });
    }

    // Create the new template
    const newTemplate = {
      id: this.prescriptionId || storedPrescriptions.length + 1,
      name: this.templateName,
      templateId: this.selectedTemplate,
      clinic: this.clinicName,
      clinicAddress: this.clinicAddress,
      clinicPhone: this.clinicPhone,
      mrcNumber: this.mrcNumber,
      physicianName: this.physicianName,
      physicianQualification: this.physicianQualification,
      clinicTimings: this.clinicTimings,
      footerText: this.footerText,
      isDefault: this.isDefault,

      // Store font styles and colors for each field
      clinicNameFontType: this.clinicNameFontType,
      clinicNameFontSize: this.clinicNameFontSize,
      clinicNameFontColor: this.clinicNameFontColor,

      clinicAddressFontType: this.clinicAddressFontType,
      clinicAddressFontSize: this.clinicAddressFontSize,
      clinicAddressFontColor: this.clinicAddressFontColor,

      clinicPhoneFontType: this.clinicPhoneFontType,
      clinicPhoneFontSize: this.clinicPhoneFontSize,
      clinicPhoneFontColor: this.clinicPhoneFontColor,

      physicianNameFontType: this.physicianNameFontType,
      physicianNameFontSize: this.physicianNameFontSize,
      physicianNameFontColor: this.physicianNameFontColor,

      clinicTimingsFontType: this.clinicTimingsFontType,
      clinicTimingsFontSize: this.clinicTimingsFontSize,
      clinicTimingsFontColor: this.clinicTimingsFontColor,

      mrcNumberFontType: this.mrcNumberFontType,
      mrcNumberFontSize: this.mrcNumberFontSize,
      mrcNumberFontColor: this.mrcNumberFontColor,

      qualificationFontType: this.qualificationFontType,
      qualificationFontSize: this.qualificationFontSize,
      qualificationFontColor: this.qualificationFontColor,

      footerTextFontType: this.footerTextFontType,
      footerTextFontSize: this.footerTextFontSize,
      footerTextFontColor: this.footerTextFontColor,

      logoImage: this.logoImage // Save the logo image
    };

    // If in edit mode, update the template, otherwise, push it as a new one
    if (this.isEditMode) {
      const templateIndex = storedPrescriptions.findIndex(p => p.id === this.prescriptionId);
      if (templateIndex > -1) {
        storedPrescriptions[templateIndex] = newTemplate; // Update the existing template
      }
    } else {
      storedPrescriptions.push(newTemplate); // Add new template
    }

    // Save all templates to IndexedDB
    await this.savePrescriptions(storedPrescriptions);

    // Save PDF
    const tempFileName = `temp_${this.templateName}_template${this.selectedTemplate}.pdf`;
    const finalFileName = `${this.templateName}_template${this.selectedTemplate}.pdf`;

    const tempPdfData = await this.getPdfFromIndexedDB(tempFileName);
    if (tempPdfData) {
      await this.savePdfToIndexedDB(finalFileName, tempPdfData);
    } else {
      await this.generatePDF({});
      const pdfData = await this.getPdfFromIndexedDB(tempFileName);
      if (pdfData) {
        await this.savePdfToIndexedDB(finalFileName, pdfData);
      }
      console.error('Temporary PDF not found in IndexedDB');
    }

    this.router.navigate(['/physician/design-prescription']);
  }

  async getAllPrescriptions(): Promise<any[]> {
    const db = await this.openIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['prescriptions'], 'readonly');
      const store = transaction.objectStore('prescriptions');
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject('Error fetching prescriptions');
      };
    });
  }

  async savePrescriptions(prescriptions: any[]) {
    const db = await this.openIndexedDB();
    const transaction = db.transaction(['prescriptions'], 'readwrite');
    const store = transaction.objectStore('prescriptions');

    prescriptions.forEach(template => {
      store.put(template); // Save each template
    });

    transaction.oncomplete = () => {
      console.log('Prescriptions saved successfully');
    };

    transaction.onerror = () => {
      console.error('Error saving prescriptions');
    };
  }



  openIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('prescriptionsDB', 2);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('prescriptions')) {
          db.createObjectStore('prescriptions', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('pdfs')) {
          db.createObjectStore('pdfs', { keyPath: 'name' });
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

  async savePrescriptionData(newTemplate: any) {
    const db = await this.openIndexedDB();
    const transaction = db.transaction(['prescriptions'], 'readwrite');
    const store = transaction.objectStore('prescriptions');
    store.put(newTemplate);

    transaction.oncomplete = () => {
      console.log('Prescription saved successfully');
    };

    transaction.onerror = () => {
      console.error('Error saving prescription');
    };
  }

  async loadPrescription(id: number) {
    const db = await this.openIndexedDB();
    const transaction = db.transaction(['prescriptions'], 'readonly');
    const store = transaction.objectStore('prescriptions');
    const request = store.get(id);

    request.onsuccess = (event: any) => {
      const prescription = event.target.result;
      if (prescription) {
        // Populate the fields
        this.templateName = prescription.name;
        this.selectedTemplate = prescription.templateId;
        this.clinicName = prescription.clinic;
        this.clinicAddress = prescription.clinicAddress;
        this.clinicPhone = prescription.clinicPhone;
        this.mrcNumber = prescription.mrcNumber;
        this.physicianName = prescription.physicianName;
        this.physicianQualification = prescription.physicianQualification;
        this.clinicTimings = prescription.clinicTimings;
        this.footerText = prescription.footerText;
        this.isDefault = prescription.isDefault;

        // Load font styles and colors for each field
        this.clinicNameFontType = prescription.clinicNameFontType;
        this.clinicNameFontSize = prescription.clinicNameFontSize;
        this.clinicNameFontColor = prescription.clinicNameFontColor;

        this.clinicAddressFontType = prescription.clinicAddressFontType;
        this.clinicAddressFontSize = prescription.clinicAddressFontSize;
        this.clinicAddressFontColor = prescription.clinicAddressFontColor;

        this.clinicPhoneFontType = prescription.clinicPhoneFontType;
        this.clinicPhoneFontSize = prescription.clinicPhoneFontSize;
        this.clinicPhoneFontColor = prescription.clinicPhoneFontColor;

        this.physicianNameFontType = prescription.physicianNameFontType;
        this.physicianNameFontSize = prescription.physicianNameFontSize;
        this.physicianNameFontColor = prescription.physicianNameFontColor;

        this.clinicTimingsFontType = prescription.clinicTimingsFontType;
        this.clinicTimingsFontSize = prescription.clinicTimingsFontSize;
        this.clinicTimingsFontColor = prescription.clinicTimingsFontColor;

        this.mrcNumberFontType = prescription.mrcNumberFontType;
        this.mrcNumberFontSize = prescription.mrcNumberFontSize;
        this.mrcNumberFontColor = prescription.mrcNumberFontColor;

        this.qualificationFontType = prescription.qualificationFontType;
        this.qualificationFontSize = prescription.qualificationFontSize;
        this.qualificationFontColor = prescription.qualificationFontColor;

        this.footerTextFontType = prescription.footerTextFontType;
        this.footerTextFontSize = prescription.footerTextFontSize;
        this.footerTextFontColor = prescription.footerTextFontColor;

        this.logoImage = prescription.logoImage; // Load the logo image as well
      }
    };

    request.onerror = () => {
      console.error('Error loading prescription');
    };
  }

  async savePdfToIndexedDB(pdfName: string, pdfBlob: Blob) {
    const db = await this.openIndexedDB();
    const transaction = db.transaction(['pdfs'], 'readwrite');
    const store = transaction.objectStore('pdfs');
    store.put({ name: pdfName, pdfBlob: pdfBlob });

    transaction.oncomplete = () => {
      console.log(`PDF stored as ${pdfName}`);
    };

    transaction.onerror = () => {
      console.error('Error saving PDF to IndexedDB');
    };
  }

  async getPdfFromIndexedDB(pdfName: string): Promise<Blob | null> {
    return new Promise(async (resolve, reject) => {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(['pdfs'], 'readonly');
      const store = transaction.objectStore('pdfs');
      const request = store.get(pdfName);

      request.onsuccess = (event: any) => {
        const result = event.target.result;
        if (result) {
          resolve(result.pdfBlob); // Return the PDF blob
        } else {
          console.error('PDF not found in IndexedDB');
          resolve(null); // No PDF found, return null
        }
      };

      request.onerror = () => {
        console.error('Error retrieving PDF from IndexedDB');
        reject(new Error('Error retrieving PDF from IndexedDB'));
      };
    });
  }

  goBack() {
    // Hide the tooltip by disposing of it
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      const tooltipInstance = Tooltip.getInstance(tooltipTriggerEl); // Get the tooltip instance
      if (tooltipInstance) {
        tooltipInstance.dispose(); // Dispose of the tooltip
      }
    });

    // Navigate back to the design prescription page
    this.router.navigate(['/physician/design-prescription']);
  }

}

