package medical_record_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import medical_record_backend.entity.LabReport;
import medical_record_backend.entity.Patient;
import medical_record_backend.repository.LabReportRepository;
import medical_record_backend.repository.PatientRepository;

@Service
public class LabReportService {

    private final LabReportRepository labReportRepository;
    private final PatientRepository patientRepository;

    public LabReportService(
            LabReportRepository labReportRepository,
            PatientRepository patientRepository
    ) {
        this.labReportRepository = labReportRepository;
        this.patientRepository = patientRepository;
    }

    // GET lab reports for a patient
    public List<LabReport> getPatientLabReports(Long patientId) {

        if (!patientRepository.existsById(patientId)) {
            throw new RuntimeException("Patient not found");
        }

        return labReportRepository
                .findByPatientIdOrderByReportDateDesc(patientId);
    }

    // CREATE a new lab report
    public LabReport createLabReport(
            Long patientId,
            LabReport labReport
    ) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found")
                );

        labReport.setId(null);
        labReport.setPatient(patient);

        return labReportRepository.save(labReport);
    }

    // DELETE a lab report
    public void deleteLabReport(
            Long reportId,
            Long patientId
    ) {

        LabReport labReport = labReportRepository
                .findById(reportId)
                .orElseThrow(() ->
                        new RuntimeException("Lab report not found")
                );

        if (!labReport.getPatient().getId().equals(patientId)) {
            throw new RuntimeException(
                    "You are not authorized to delete this lab report"
            );
        }

        labReportRepository.deleteById(reportId);
    }
}