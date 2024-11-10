import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalCasesComponent } from './medical-cases.component';

describe('MedicalCasesComponent', () => {
  let component: MedicalCasesComponent;
  let fixture: ComponentFixture<MedicalCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalCasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
