import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbTooltipConfig, NgbDateStruct, NgbDate, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { Modal } from 'bootstrap';
import { Appointment } from '../../../shared/models/appointment';

@Component({
  selector: 'app-manage-appointments',
  templateUrl: './manage-appointments.component.html',
  styleUrls: ['./manage-appointments.component.scss'],
  providers: [NgbTooltipConfig]
})
export class ManageAppointmentsComponent implements OnInit {
  @ViewChild('proposeTimeModal') proposeTimeModal!: ElementRef;
  @ViewChild('rejectReasonModal') rejectReasonModal!: ElementRef;
  @ViewChild('t') dateTemplate!: TemplateRef<any>; // Add this line
  @ViewChild('dateRangePicker') dateRangePicker!: NgbDatepicker;
  appointmentsForm!: FormGroup;
  pendingAppointments: Appointment[] = [];
  filteredPendingAppointments: Appointment[] = [];
  acceptedAppointments: Appointment[] = [];
  rejectedAppointments: Appointment[] = [];
  proposeTimeForm!: FormGroup;
  rejectReasonForm!: FormGroup;
  selectedAppointment!: Appointment;
  clinics: string[] = ['Clinic A', 'Clinic B', 'Clinic C'];
  sortDirection: { [key: string]: string } = {};
  dateRange: { startDate: NgbDateStruct | null, endDate: NgbDateStruct | null } = { startDate: null, endDate: null };
  

  constructor(private fb: FormBuilder, config: NgbTooltipConfig) {
    config.placement = 'top';
    config.triggers = 'hover';
  }

  ngOnInit(): void {
    this.appointmentsForm = this.fb.group({
      startDate: [''],
      endDate: ['']
    });
    this.proposeTimeForm = this.fb.group({
      newDate: [''],
      newTime: [''],
      clinicName: ['']
    });

    this.rejectReasonForm = this.fb.group({
      reason: ['']
    });

    // Load appointments
    this.loadAppointments();
  }

  loadAppointments(): void {
    // Adding static data for demonstration
    this.pendingAppointments = [
      {
        patientName: 'John Doe',
        appointmentDate: new Date('2024-08-01'),
        appointmentTime: '10:00 AM',
        clinicName: 'Clinic A',
        mobileNumber: '9876543210'
      },
      {
        patientName: 'Jane Smith',
        appointmentDate: new Date('2024-08-02'),
        appointmentTime: '11:00 AM',
        clinicName: 'Clinic B',
        mobileNumber: '9876543211',
        proposed: true,
        newDate: new Date('2024-08-03'),
        newTime: '11:30 AM'
      },
      {
        patientName: 'Rajesh Kumar',
        appointmentDate: new Date('2024-07-15'),
        appointmentTime: '09:00 AM',
        clinicName: 'Clinic C',
        mobileNumber: '9876543212'
      },
      {
        patientName: 'Anita Singh',
        appointmentDate: new Date('2024-07-16'),
        appointmentTime: '10:30 AM',
        clinicName: 'Clinic A',
        mobileNumber: '9876543213'
      }
    ];

    this.acceptedAppointments = [
      {
        patientName: 'Michael Brown',
        appointmentDate: new Date('2024-07-20'),
        appointmentTime: '09:00 AM',
        clinicName: 'Clinic A',
        mobileNumber: '9876543214'
      },
      {
        patientName: 'Emily Davis',
        appointmentDate: new Date('2024-07-21'),
        appointmentTime: '12:00 PM',
        clinicName: 'Clinic C',
        mobileNumber: '9876543215'
      }
    ];

    this.rejectedAppointments = [
      {
        patientName: 'Chris Wilson',
        appointmentDate: new Date('2024-07-19'),
        appointmentTime: '02:00 PM',
        clinicName: 'Clinic B',
        mobileNumber: '9876543216',
        reason: 'Patient request'
      }
    ];

    this.filteredPendingAppointments = [...this.pendingAppointments];
  }

 

  filterAppointmentsByDate(): void {
    const startDate = this.appointmentsForm.get('startDate')?.value;
    const endDate = this.appointmentsForm.get('endDate')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      this.filteredPendingAppointments = this.pendingAppointments.filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate);
        return appointmentDate >= start && appointmentDate <= end;
      });
    } else {
      this.filteredPendingAppointments = [...this.pendingAppointments];
    }
  }

  after(start: NgbDateStruct, end: NgbDateStruct): boolean {
    if (start.year === end.year) {
      if (start.month === end.month) {
        return start.day < end.day;
      }
      return start.month < end.month;
    }
    return start.year < end.year;
  }

  sortAppointments(column: keyof Appointment): void {
    const direction = this.sortDirection[column] === 'asc' ? 'desc' : 'asc';
    this.sortDirection[column] = direction;
    this.filteredPendingAppointments.sort((a, b) => {
      const aValue = a[column] ?? '';
      const bValue = b[column] ?? '';

      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  acceptAppointment(appointment: Appointment): void {
    this.acceptedAppointments.push(appointment);
    this.pendingAppointments = this.pendingAppointments.filter(app => app !== appointment);
    this.filteredPendingAppointments = this.filteredPendingAppointments.filter(app => app !== appointment);
  }

  proposeNewTime(appointment: Appointment): void {
    this.selectedAppointment = appointment;
    const proposeTimeModalInstance = new Modal(this.proposeTimeModal.nativeElement);
    proposeTimeModalInstance.show();
  }

  saveProposedTime(): void {
    const proposeTimeModalInstance = Modal.getInstance(this.proposeTimeModal.nativeElement);
    proposeTimeModalInstance?.hide();
    // Update the appointment status
    if (this.selectedAppointment) {
      this.selectedAppointment.proposed = true;
      this.selectedAppointment.newDate = this.proposeTimeForm.value.newDate;
      this.selectedAppointment.newTime = this.proposeTimeForm.value.newTime;
      this.selectedAppointment.clinicName = this.proposeTimeForm.value.clinicName;
    }
  }

  rejectAppointment(appointment: Appointment): void {
    this.selectedAppointment = appointment;
    const rejectReasonModalInstance = new Modal(this.rejectReasonModal.nativeElement);
    rejectReasonModalInstance.show();
  }

  confirmReject(): void {
    const reason = this.rejectReasonForm.value.reason;
    if (this.selectedAppointment) {
      // Handle reject appointment with reason
      this.selectedAppointment.reason = reason;
      this.rejectedAppointments.push(this.selectedAppointment);
      this.pendingAppointments = this.pendingAppointments.filter(app => app !== this.selectedAppointment);
      this.filteredPendingAppointments = this.filteredPendingAppointments.filter(app => app !== this.selectedAppointment);
    }
    const rejectReasonModalInstance = Modal.getInstance(this.rejectReasonModal.nativeElement);
    rejectReasonModalInstance?.hide();
  }

  isUpcoming(appointment: Appointment): boolean {
    const today = new Date();
    const appointmentDate = new Date(appointment.appointmentDate);
    return appointmentDate >= today;
  }
}
