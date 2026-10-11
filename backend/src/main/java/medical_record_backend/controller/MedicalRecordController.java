package medical_record_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import medical_record_backend.entity.MedicalRecord;
import medical_record_backend.service.MedicalRecordService;

@RestController
@RequestMapping("/api/medical-records")
@CrossOrigin(origins = "http://localhost:5173")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    public MedicalRecordController(
            MedicalRecordService medicalRecordService
    ) {
        this.medicalRecordService = medicalRecordService;
    }

    // GET medical records for a patient
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getPatientRecords(
            @PathVariable Long patientId
    ) {
        try {
            List<MedicalRecord> records =
                    medicalRecordService.getPatientRecords(patientId);

            return ResponseEntity.ok(records);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // CREATE a new medical record
    @PostMapping("/patient/{patientId}")
    public ResponseEntity<?> createMedicalRecord(
            @PathVariable Long patientId,
            @RequestBody MedicalRecord medicalRecord
    ) {
        try {
            MedicalRecord savedRecord =
                    medicalRecordService.createMedicalRecord(
                            patientId,
                            medicalRecord
                    );

            return ResponseEntity.ok(savedRecord);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // DELETE a medical record
    @DeleteMapping("/patient/{patientId}/{recordId}")
    public ResponseEntity<?> deleteMedicalRecord(
            @PathVariable Long patientId,
            @PathVariable Long recordId
    ) {
        try {
            medicalRecordService.deleteMedicalRecord(
                    recordId,
                    patientId
            );

            return ResponseEntity.ok(
                    "Medical record deleted successfully."
            );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}