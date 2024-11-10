import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateMedicalCertificateComponent } from './generate-medical-certificate.component';

describe('GenerateMedicalCertificateComponent', () => {
  let component: GenerateMedicalCertificateComponent;
  let fixture: ComponentFixture<GenerateMedicalCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerateMedicalCertificateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateMedicalCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
