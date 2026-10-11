package medical_record_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import medical_record_backend.entity.MedicalRecord;

public interface MedicalRecordRepository
        extends JpaRepository<MedicalRecord, Long> {

    List<MedicalRecord> findByPatientIdOrderByRecordDateDesc(
            Long patientId
    );

    long countByPatientId(Long patientId);

    void deleteByPatientId(Long patientId);
}