import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMedicalCaseComponent } from './new-medical-case.component';

describe('NewMedicalCaseComponent', () => {
  let component: NewMedicalCaseComponent;
  let fixture: ComponentFixture<NewMedicalCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewMedicalCaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMedicalCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
