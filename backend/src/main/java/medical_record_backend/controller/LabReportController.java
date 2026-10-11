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

import medical_record_backend.entity.LabReport;
import medical_record_backend.service.LabReportService;

@RestController
@RequestMapping("/api/lab-reports")
@CrossOrigin(origins = "http://localhost:5173")
public class LabReportController {

    private final LabReportService labReportService;

    public LabReportController(LabReportService labReportService) {
        this.labReportService = labReportService;
    }

    // GET lab reports for a patient
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getPatientLabReports(
            @PathVariable Long patientId
    ) {
        try {
            List<LabReport> reports =
                    labReportService.getPatientLabReports(patientId);

            return ResponseEntity.ok(reports);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // CREATE a new lab report
    @PostMapping("/patient/{patientId}")
    public ResponseEntity<?> createLabReport(
            @PathVariable Long patientId,
            @RequestBody LabReport labReport
    ) {
        try {
            LabReport savedReport =
                    labReportService.createLabReport(
                            patientId,
                            labReport
                    );

            return ResponseEntity.ok(savedReport);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // DELETE a lab report
    @DeleteMapping("/patient/{patientId}/{reportId}")
    public ResponseEntity<?> deleteLabReport(
            @PathVariable Long patientId,
            @PathVariable Long reportId
    ) {
        try {
            labReportService.deleteLabReport(
                    reportId,
                    patientId
            );

            return ResponseEntity.ok(
                    "Lab report deleted successfully."
            );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}