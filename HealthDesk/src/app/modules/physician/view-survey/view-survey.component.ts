import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Question {
  text: string;
  response: string;
}

interface Survey {
  id: number;
  name: string;
  creator: string;
  company: string;
  takenDate: Date;
  questions: Question[];
}

@Component({
  selector: 'app-view-survey',
  templateUrl: './view-survey.component.html',
  styleUrls: ['./view-survey.component.scss']
})
export class ViewSurveyComponent implements OnInit {
  survey: Survey = {
    id: 1,
    name: 'Survey 1',
    creator: 'Dr. Smith',
    company: 'HealthCorp',
    takenDate: new Date(),
    questions: [
      { text: 'Question 1', response: 'Response 1' },
      { text: 'Question 2', response: 'Response 2' },
      // Add more questions and responses as needed
    ]
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const surveyId = this.route.snapshot.paramMap.get('id');
    // Fetch survey details using surveyId if needed
  }
}
