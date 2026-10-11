package medical_record_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import medical_record_backend.entity.MedicalRecord;
import medical_record_backend.entity.Patient;
import medical_record_backend.repository.MedicalRecordRepository;
import medical_record_backend.repository.PatientRepository;

@Service
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;

    public MedicalRecordService(
            MedicalRecordRepository medicalRecordRepository,
            PatientRepository patientRepository
    ) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.patientRepository = patientRepository;
    }

    // GET medical records for a patient
    public List<MedicalRecord> getPatientRecords(Long patientId) {

        if (!patientRepository.existsById(patientId)) {
            throw new RuntimeException("Patient not found");
        }

        return medicalRecordRepository
                .findByPatientIdOrderByRecordDateDesc(patientId);
    }

    // CREATE a new medical record
    public MedicalRecord createMedicalRecord(
            Long patientId,
            MedicalRecord medicalRecord
    ) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found")
                );

        medicalRecord.setId(null);
        medicalRecord.setPatient(patient);

        return medicalRecordRepository.save(medicalRecord);
    }

    // DELETE a medical record
    public void deleteMedicalRecord(
            Long recordId,
            Long patientId
    ) {

        MedicalRecord medicalRecord = medicalRecordRepository
                .findById(recordId)
                .orElseThrow(() ->
                        new RuntimeException("Medical record not found")
                );

        // Make sure the record belongs to this patient
        if (!medicalRecord.getPatient().getId().equals(patientId)) {
            throw new RuntimeException(
                    "You are not authorized to delete this medical record"
            );
        }

        medicalRecordRepository.deleteById(recordId);
    }
}