import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalJournalComponent } from './medical-journal.component';

describe('MedicalJournalComponent', () => {
  let component: MedicalJournalComponent;
  let fixture: ComponentFixture<MedicalJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalJournalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
