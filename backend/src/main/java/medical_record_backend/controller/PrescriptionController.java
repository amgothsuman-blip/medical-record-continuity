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

import medical_record_backend.entity.Prescription;
import medical_record_backend.service.PrescriptionService;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "http://localhost:5173")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    public PrescriptionController(
            PrescriptionService prescriptionService
    ) {
        this.prescriptionService = prescriptionService;
    }

    // GET prescriptions for a patient
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getPatientPrescriptions(
            @PathVariable Long patientId
    ) {
        try {
            List<Prescription> prescriptions =
                    prescriptionService.getPatientPrescriptions(patientId);

            return ResponseEntity.ok(prescriptions);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // CREATE prescription
    @PostMapping("/patient/{patientId}")
    public ResponseEntity<?> createPrescription(
            @PathVariable Long patientId,
            @RequestBody Prescription prescription
    ) {
        try {
            Prescription savedPrescription =
                    prescriptionService.createPrescription(
                            patientId,
                            prescription
                    );

            return ResponseEntity.ok(savedPrescription);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // DELETE prescription
    @DeleteMapping("/patient/{patientId}/{prescriptionId}")
    public ResponseEntity<?> deletePrescription(
            @PathVariable Long patientId,
            @PathVariable Long prescriptionId
    ) {
        try {
            prescriptionService.deletePrescription(
                    prescriptionId,
                    patientId
            );

            return ResponseEntity.ok(
                    "Prescription deleted successfully."
            );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}