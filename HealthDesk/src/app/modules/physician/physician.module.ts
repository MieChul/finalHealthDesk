import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhysicianRoutingModule } from './physician-routing.module';
import { PhysicianComponent } from './physician.component';
import { AddProfileComponent } from './add-profile/add-profile.component';
import { DesignPrescriptionComponent } from './design-prescription/design-prescription.component';
import { GenerateMedicalCertificateComponent } from './generate-medical-certificate/generate-medical-certificate.component';
import { GeneratePrescriptionComponent } from './generate-prescription/generate-prescription.component';
import { LandingComponent } from './landing/landing.component';
import { ManageAppointmentsComponent } from './manage-appointments/manage-appointments.component';
import { ManagePatientComponent } from './manage-patient/manage-patient.component';
import { MedicalCasesComponent } from './medical-cases/medical-cases.component';
import { MedicalJournalComponent } from './medical-journal/medical-journal.component';
import { NewMedicalCaseComponent } from './new-medical-case/new-medical-case.component';
import { PatientComponent } from './patient/patient.component';
import { SelectTemplateComponent } from './select-template/select-template.component';
import { SurveyComponent } from './survey/survey.component';
import { TakeSurveyComponent } from './take-survey/take-survey.component';
import { ViewMedicalCaseComponent } from './view-medical-case/view-medical-case.component';
import { ViewMedicalJournalComponent } from './view-medical-journal/view-medical-journal.component';
import { ViewSurveyComponent } from './view-survey/view-survey.component';
import { CustomizePrescriptionComponent } from './customize-prescription/customize-prescription.component';
import { SharedModule } from '../../shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    PhysicianComponent,
    AddProfileComponent,
    CustomizePrescriptionComponent,
    DesignPrescriptionComponent,
    GenerateMedicalCertificateComponent,
    GeneratePrescriptionComponent,
    LandingComponent,
    ManageAppointmentsComponent,
    ManagePatientComponent,
    MedicalCasesComponent,
    MedicalJournalComponent,
    NewMedicalCaseComponent,
    PatientComponent,
    SelectTemplateComponent,
    SurveyComponent,
    TakeSurveyComponent,
    ViewMedicalCaseComponent,
    ViewMedicalJournalComponent,
    ViewSurveyComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PhysicianRoutingModule,
    NgMultiSelectDropDownModule
  ]
})
export class PhysicianModule { }
