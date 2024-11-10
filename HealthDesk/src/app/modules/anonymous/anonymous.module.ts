import { NgModule } from '@angular/core';
import { AnonymousRoutingModule } from './anonymous-routing.module';
import { LoginComponent } from './login/login.component';
import { RoleSelectComponent } from './role-selection/role-selection.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SharedModule } from '../../shared/shared.module';
import { VerifyForgotPasswordComponent } from './verify-forgot-password/verify-forgot-password.component';


@NgModule({
  declarations: [
    LoginComponent,
    RoleSelectComponent,
    VerifyOtpComponent,
    RegisterComponent,
    VerifyForgotPasswordComponent,
    ForgotPasswordComponent,
  ],
  imports: [
    SharedModule,
    AnonymousRoutingModule
  ]
})
export class AnonymousModule { }
