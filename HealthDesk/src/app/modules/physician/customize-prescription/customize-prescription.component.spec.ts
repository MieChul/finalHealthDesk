import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizePrescriptionComponent } from './customize-prescription.component';

describe('CustomizePrescriptionComponent', () => {
  let component: CustomizePrescriptionComponent;
  let fixture: ComponentFixture<CustomizePrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomizePrescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomizePrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
