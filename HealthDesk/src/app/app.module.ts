import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';



@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        SharedModule,
        RouterModule.forRoot([]),
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, [provideHttpClient()]
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
