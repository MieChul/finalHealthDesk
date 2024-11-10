import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './shared/components/about-us/about-us.component'
import { ContactUsComponent } from './shared/components//contact-us/contact-us.component';
import { RoleGuard } from './shared/guards/role.guard';
const physicianModule = () => import('./modules/physician/physician.module').then(x => x.PhysicianModule);
const patientModule = () => import('./modules/patient/patient.module').then(x => x.PatientModule);
const anonymousModule = () => import('./modules/anonymous/anonymous.module').then(x => x.AnonymousModule);
const organizationModule = () => import('./modules/organization/organization.module').then(x => x.OrganizationModule);
const adminModule = () => import('./modules/admin/admin.module').then(x => x.AdminModule);
const routes: Routes = [
    { path: 'physician', loadChildren: physicianModule },
    { path: 'patient', loadChildren: patientModule  , canActivate: [RoleGuard], data: { roles: ['patient'] } },
    { path: 'organization', loadChildren: organizationModule , canActivate: [RoleGuard], data: { roles: ['organization'] } },
    { path: '', loadChildren: anonymousModule },
    { path: 'about-us', component: AboutUsComponent },
    { path: 'contact-us', component: ContactUsComponent },
    { path: 'admin', loadChildren:adminModule, canActivate: [RoleGuard], data: { roles: ['Admin'] } },
    { path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule) },
    { path: 'patient', loadChildren: () => import('./modules/patient/patient.module').then(m => m.PatientModule) },
    { path: 'physician', loadChildren: () => import('./modules/physician/physician.module').then(m => m.PhysicianModule) },
    { path: 'organization', loadChildren: () => import('./modules/organization/organization.module').then(m => m.OrganizationModule) },
    { path: 'anonymous', loadChildren: () => import('./modules/anonymous/anonymous.module').then(m => m.AnonymousModule) }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
