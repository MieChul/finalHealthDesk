import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

interface Question {
  text: string;
  response: string;
}

interface Survey {
  id: number;
  name: string;
  number: string;
  creator: string;
  company: string;
  questions: Question[];
}

@Component({
  selector: 'app-take-survey',
  templateUrl: './take-survey.component.html',
  styleUrls: ['./take-survey.component.scss']
})
export class TakeSurveyComponent implements OnInit {
  surveyForm!: FormGroup;
  survey: Survey = {
    id: 1,
    name: 'Survey 1',
    number: '001',
    creator: 'Dr. Smith',
    company: 'HealthCorp',
    questions: [
      { text: 'Question 1', response: '' },
      { text: 'Question 2', response: '' },
      // Add more questions as needed
    ]
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const surveyId = this.route.snapshot.paramMap.get('id');
    // Fetch survey details using surveyId if needed

    this.surveyForm = this.fb.group({
      name: [this.survey.name],
      number: [this.survey.number],
      creator: [this.survey.creator],
      company: [this.survey.company],
      questions: this.fb.array(this.survey.questions.map(question => this.fb.group({
        text: [question.text],
        response: [question.response]
      })))
    });
  }

  get questions(): FormArray {
    return this.surveyForm.get('questions') as FormArray;
  }

  submitSurvey(): void {
    if (this.surveyForm.valid) {
      // Handle survey submission
      console.log(this.surveyForm.value);
      this.router.navigate(['/physician/view-survey', this.survey.id]);
    }
  }
}
