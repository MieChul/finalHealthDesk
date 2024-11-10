import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMedicalCaseComponent } from './view-medical-case.component';

describe('ViewMedicalCaseComponent', () => {
  let component: ViewMedicalCaseComponent;
  let fixture: ComponentFixture<ViewMedicalCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewMedicalCaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMedicalCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
