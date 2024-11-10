import { Component, OnInit } from '@angular/core';

interface Journal {
  id: number;
  name: string;
  publisher: string;
  speciality: string;
  subSpeciality: string;
  country: string;
  frequency: string;
  firstIssueDate: string;
  issuesPerYear: number;
  impactFactor: number;
  indexCopernicus: string;
  webLink: string;
  authorGuidelines: string;
}

@Component({
  selector: 'app-medical-journal',
  templateUrl: './medical-journal.component.html',
  styleUrls: ['./medical-journal.component.scss']
})
export class MedicalJournalComponent implements OnInit {
  journals: Journal[] = [
    {
      id: 1, name: 'Journal A', publisher: 'Publisher A', speciality: 'Cardiology',
      subSpeciality: 'Pediatric Cardiology', country: 'USA', frequency: 'Monthly',
      firstIssueDate: '2020-01-01', issuesPerYear: 12, impactFactor: 4.5,
      indexCopernicus: 'Yes', webLink: 'https://example.com/journal-a', authorGuidelines: 'https://example.com/author-guidelines-a'
    },
    {
      id: 2, name: 'Journal B', publisher: 'Publisher B', speciality: 'Neurology',
      subSpeciality: 'Cognitive Neurology', country: 'UK', frequency: 'Quarterly',
      firstIssueDate: '2019-05-01', issuesPerYear: 4, impactFactor: 3.2,
      indexCopernicus: 'Yes', webLink: 'https://example.com/journal-b', authorGuidelines: 'https://example.com/author-guidelines-b'
    },
    {
      id: 3, name: 'Journal C', publisher: 'Publisher C', speciality: 'Oncology',
      subSpeciality: 'Breast Cancer', country: 'Canada', frequency: 'Bi-Annually',
      firstIssueDate: '2018-10-01', issuesPerYear: 2, impactFactor: 6.1,
      indexCopernicus: 'No', webLink: 'https://example.com/journal-c', authorGuidelines: 'https://example.com/author-guidelines-c'
    },
    {
      id: 4, name: 'Journal D', publisher: 'Publisher D', speciality: 'Dermatology',
      subSpeciality: 'Cosmetic Dermatology', country: 'Australia', frequency: 'Annually',
      firstIssueDate: '2017-03-01', issuesPerYear: 1, impactFactor: 2.5,
      indexCopernicus: 'Yes', webLink: 'https://example.com/journal-d', authorGuidelines: 'https://example.com/author-guidelines-d'
    },
    {
      id: 5, name: 'Journal E', publisher: 'Publisher E', speciality: 'Pediatrics',
      subSpeciality: 'Neonatology', country: 'India', frequency: 'Monthly',
      firstIssueDate: '2021-08-01', issuesPerYear: 12, impactFactor: 3.9,
      indexCopernicus: 'Yes', webLink: 'https://example.com/journal-e', authorGuidelines: 'https://example.com/author-guidelines-e'
    },
    {
      id: 6, name: 'Journal F', publisher: 'Publisher F', speciality: 'Orthopedics',
      subSpeciality: 'Spinal Surgery', country: 'Germany', frequency: 'Quarterly',
      firstIssueDate: '2016-02-01', issuesPerYear: 4, impactFactor: 5.0,
      indexCopernicus: 'No', webLink: 'https://example.com/journal-f', authorGuidelines: 'https://example.com/author-guidelines-f'
    },
  ];

  filteredJournals: Journal[] = [];
  searchTerm: string = '';
  sortField: keyof Journal = 'name';
  sortDirection: string = 'asc';

  filters = {
    name: '',
    publisher: '',
    speciality: '',
    subSpeciality: '',
    country: '',
    frequency: '',
    firstIssueDate: '',
    issuesPerYear: '',
    impactFactor: '',
    indexCopernicus: ''
  };

  ngOnInit(): void {
    this.filteredJournals = this.journals;
  }

  filterJournals(): void {
    this.filteredJournals = this.journals.filter(journal => {
      return Object.keys(this.filters).every(key => {
        const filterValue = (this.filters as any)[key].toLowerCase();
        return journal[key as keyof Journal]?.toString().toLowerCase().includes(filterValue);
      });
    });
  }

  sort(field: keyof Journal): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.filteredJournals.sort((a, b) => {
      let comparison = 0;
      if (a[field] > b[field]) {
        comparison = 1;
      } else if (a[field] < b[field]) {
        comparison = -1;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  getSortIcon(field: keyof Journal): string {
    if (this.sortField !== field) {
      return '';
    }
    return this.sortDirection === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill';
  }
}
