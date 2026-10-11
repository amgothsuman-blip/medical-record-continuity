package medical_record_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import medical_record_backend.entity.LabReport;

public interface LabReportRepository
        extends JpaRepository<LabReport, Long> {

    List<LabReport> findByPatientIdOrderByReportDateDesc(
            Long patientId
    );

    long countByPatientId(Long patientId);

    void deleteByPatientId(Long patientId);
}