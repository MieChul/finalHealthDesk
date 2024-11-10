import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RoleSelectComponent } from './role-selection/role-selection.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { OtpVerificationGuard } from '../../shared/guards/otp-verification.guard';
import { VerifyForgotPasswordComponent } from './verify-forgot-password/verify-forgot-password.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  { path: 'role-selection', component: RoleSelectComponent },
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: 'register', component: RegisterComponent, canActivate: [OtpVerificationGuard] },
  { path: 'verify-forgot-password', component: VerifyForgotPasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [OtpVerificationGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnonymousRoutingModule { }
