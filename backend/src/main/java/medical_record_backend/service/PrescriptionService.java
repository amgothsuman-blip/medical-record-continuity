package medical_record_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import medical_record_backend.entity.Patient;
import medical_record_backend.entity.Prescription;
import medical_record_backend.repository.PatientRepository;
import medical_record_backend.repository.PrescriptionRepository;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;

    public PrescriptionService(
            PrescriptionRepository prescriptionRepository,
            PatientRepository patientRepository
    ) {
        this.prescriptionRepository = prescriptionRepository;
        this.patientRepository = patientRepository;
    }

    // GET prescriptions for a patient
    public List<Prescription> getPatientPrescriptions(Long patientId) {

        if (!patientRepository.existsById(patientId)) {
            throw new RuntimeException("Patient not found");
        }

        return prescriptionRepository
            .findByPatientIdOrderByPrescribedDateDesc(patientId);    }

    // CREATE prescription
    public Prescription createPrescription(
            Long patientId,
            Prescription prescription
    ) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found")
                );

        prescription.setId(null);
        prescription.setPatient(patient);

        return prescriptionRepository.save(prescription);
    }

    // DELETE prescription
    public void deletePrescription(
            Long prescriptionId,
            Long patientId
    ) {

        Prescription prescription = prescriptionRepository
                .findById(prescriptionId)
                .orElseThrow(() ->
                        new RuntimeException("Prescription not found")
                );

        if (!prescription.getPatient().getId().equals(patientId)) {
            throw new RuntimeException(
                    "You are not authorized to delete this prescription"
            );
        }

        prescriptionRepository.deleteById(prescriptionId);
    }
}