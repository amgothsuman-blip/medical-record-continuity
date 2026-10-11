package medical_record_backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import medical_record_backend.entity.Patient;
import medical_record_backend.repository.AppointmentRepository;
import medical_record_backend.repository.LabReportRepository;
import medical_record_backend.repository.MedicalRecordRepository;
import medical_record_backend.repository.PatientRepository;
import medical_record_backend.repository.PrescriptionRepository;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;

    private final MedicalRecordRepository medicalRecordRepository;
    private final LabReportRepository labReportRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;

    public PatientService(
            PatientRepository patientRepository,
            PasswordEncoder passwordEncoder,
            MedicalRecordRepository medicalRecordRepository,
            LabReportRepository labReportRepository,
            PrescriptionRepository prescriptionRepository,
            AppointmentRepository appointmentRepository
    ) {
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;

        this.medicalRecordRepository = medicalRecordRepository;
        this.labReportRepository = labReportRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.appointmentRepository = appointmentRepository;
    }

    // ==================== REGISTER ====================

    public Patient registerPatient(Patient patient) {

        if (patientRepository.existsByEmail(patient.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        patient.setPassword(
                passwordEncoder.encode(patient.getPassword())
        );

        return patientRepository.save(patient);
    }


    // ==================== LOGIN ====================

    public Patient loginPatient(
            String email,
            String password
    ) {

        Patient patient =
                patientRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid email or password"
                                )
                        );

        if (!passwordEncoder.matches(
                password,
                patient.getPassword()
        )) {
            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        return patient;
    }


    // ==================== UPDATE PATIENT ====================

    public Patient updatePatient(
            Long patientId,
            Patient updatedPatient
    ) {

        Patient existingPatient =
                patientRepository.findById(patientId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient not found"
                                )
                        );

        existingPatient.setFullName(
                updatedPatient.getFullName()
        );

        existingPatient.setEmail(
                updatedPatient.getEmail()
        );

        existingPatient.setPhone(
                updatedPatient.getPhone()
        );

        existingPatient.setDateOfBirth(
                updatedPatient.getDateOfBirth()
        );

        existingPatient.setGender(
                updatedPatient.getGender()
        );

        existingPatient.setBloodGroup(
                updatedPatient.getBloodGroup()
        );

        existingPatient.setAddress(
                updatedPatient.getAddress()
        );

        return patientRepository.save(existingPatient);
    }


    // ==================== DELETE ACCOUNT ====================

    @Transactional
    public void deletePatient(Long patientId) {

        // Check whether patient exists
        if (!patientRepository.existsById(patientId)) {
            throw new RuntimeException(
                    "Patient not found"
            );
        }

        /*
         * Delete all patient-related data first.
         * This prevents foreign-key constraint errors.
         */

        appointmentRepository.deleteByPatientId(patientId);

        labReportRepository.deleteByPatientId(patientId);

        prescriptionRepository.deleteByPatientId(patientId);

        medicalRecordRepository.deleteByPatientId(patientId);

        // Finally delete the patient account
        patientRepository.deleteById(patientId);
    }
}