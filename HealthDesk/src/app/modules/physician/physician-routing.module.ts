import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhysicianComponent } from './physician.component';
import { LandingComponent } from './landing/landing.component';
import { ManagePatientComponent } from './manage-patient/manage-patient.component';
import { DesignPrescriptionComponent } from './design-prescription/design-prescription.component';
import { GeneratePrescriptionComponent } from './generate-prescription/generate-prescription.component';
import { ManageAppointmentsComponent } from './manage-appointments/manage-appointments.component';
import { GenerateMedicalCertificateComponent } from './generate-medical-certificate/generate-medical-certificate.component';
import { MedicalCasesComponent } from './medical-cases/medical-cases.component';
import { NewMedicalCaseComponent } from './new-medical-case/new-medical-case.component';
import { ViewMedicalCaseComponent } from './view-medical-case/view-medical-case.component';
import { SurveyComponent } from './survey/survey.component';
import { ViewSurveyComponent } from './view-survey/view-survey.component';
import { TakeSurveyComponent } from './take-survey/take-survey.component';
import { MedicalJournalComponent } from './medical-journal/medical-journal.component';
import { ViewMedicalJournalComponent } from './view-medical-journal/view-medical-journal.component';
import { AddProfileComponent } from './add-profile/add-profile.component';
import { CustomizePrescriptionComponent } from './customize-prescription/customize-prescription.component';
import { SelectTemplateComponent } from './select-template/select-template.component';

const routes: Routes = [{
  path: '', component: PhysicianComponent,
  children: [
    { path: '', component: LandingComponent, data: { showSidebar: false } },
    { path: 'patient-record', component: ManagePatientComponent },
    { path: 'design-prescription', component: DesignPrescriptionComponent },
    { path: 'generate-prescription', component: GeneratePrescriptionComponent },
    { path: 'appointments', component: ManageAppointmentsComponent },
    { path: 'generate-certificate', component: GenerateMedicalCertificateComponent },
    { path: 'medical-cases', component: MedicalCasesComponent },
    { path: 'new-medical-case', component: NewMedicalCaseComponent },
    { path: 'view-medical-case/:id', component: ViewMedicalCaseComponent },
    { path: 'survey', component: SurveyComponent },
    { path: 'view-survey/:id', component: ViewSurveyComponent },
    { path: 'take-survey/:id', component: TakeSurveyComponent },
    { path: 'medical-journal', component: MedicalJournalComponent },
    { path: 'view-medical-journal/:id', component: ViewMedicalJournalComponent },
    { path: 'add-profile', component: AddProfileComponent },
    { path: 'customize-prescription', component: CustomizePrescriptionComponent },
    { path: 'select-template', component: SelectTemplateComponent },
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhysicianRoutingModule { }
