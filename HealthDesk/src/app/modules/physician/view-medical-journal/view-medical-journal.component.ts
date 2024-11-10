import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-journal',
  templateUrl: './view-medical-journal.component.html',
  styleUrls: ['./view-medical-journal.component.scss']
})
export class ViewMedicalJournalComponent implements OnInit {
  journal: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const journalId = this.route.snapshot.paramMap.get('id');
    // Fetch journal details by ID
    this.journal = {
      id: journalId,
      title: 'Journal ' + journalId,
      speciality: 'Cardiology',
      country: 'USA',
      frequency: 'Monthly'
    }; // Dummy data
  }
}
