import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMedicalJournalComponent } from './view-medical-journal.component';

describe('ViewMedicalJournalComponent', () => {
  let component: ViewMedicalJournalComponent;
  let fixture: ComponentFixture<ViewMedicalJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewMedicalJournalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMedicalJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
