export interface Appointment {
  patientName: string;
  appointmentDate: Date;
  appointmentTime: string;
  clinicName: string;
  proposed?: boolean;
  newDate?: Date;
  newTime?: string;
  reason?: string;
  mobileNumber?: string;
}