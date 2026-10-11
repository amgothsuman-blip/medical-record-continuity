package medical_record_backend.service;

import org.springframework.stereotype.Service;

import medical_record_backend.repository.AppointmentRepository;
import medical_record_backend.repository.LabReportRepository;
import medical_record_backend.repository.MedicalRecordRepository;
import medical_record_backend.repository.PatientRepository;
import medical_record_backend.repository.PrescriptionRepository;

@Service
public class DashboardService {

    private final PatientRepository patientRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final LabReportRepository labReportRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;

    public DashboardService(
            PatientRepository patientRepository,
            MedicalRecordRepository medicalRecordRepository,
            LabReportRepository labReportRepository,
            PrescriptionRepository prescriptionRepository,
            AppointmentRepository appointmentRepository
    ) {
        this.patientRepository = patientRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.labReportRepository = labReportRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public DashboardData getDashboardData(Long patientId) {

        if (!patientRepository.existsById(patientId)) {
            throw new RuntimeException("Patient not found");
        }

        long medicalRecords =
                medicalRecordRepository.countByPatientId(patientId);

        long labReports =
                labReportRepository.countByPatientId(patientId);

        long prescriptions =
                prescriptionRepository.countByPatientId(patientId);

        long appointments =
                appointmentRepository.countByPatientId(patientId);

        return new DashboardData(
                medicalRecords,
                labReports,
                prescriptions,
                appointments
        );
    }

    public static class DashboardData {

        private long medicalRecords;
        private long labReports;
        private long prescriptions;
        private long appointments;

        public DashboardData(
                long medicalRecords,
                long labReports,
                long prescriptions,
                long appointments
        ) {
            this.medicalRecords = medicalRecords;
            this.labReports = labReports;
            this.prescriptions = prescriptions;
            this.appointments = appointments;
        }

        public long getMedicalRecords() {
            return medicalRecords;
        }

        public long getLabReports() {
            return labReports;
        }

        public long getPrescriptions() {
            return prescriptions;
        }

        public long getAppointments() {
            return appointments;
        }
    }
}