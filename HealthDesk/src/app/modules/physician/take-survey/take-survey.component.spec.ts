import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeSurveyComponent } from './take-survey.component';

describe('TakeSurveyComponent', () => {
  let component: TakeSurveyComponent;
  let fixture: ComponentFixture<TakeSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TakeSurveyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakeSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
