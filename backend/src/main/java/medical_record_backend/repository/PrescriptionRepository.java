package medical_record_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import medical_record_backend.entity.Prescription;

public interface PrescriptionRepository
        extends JpaRepository<Prescription, Long> {

    List<Prescription> findByPatientIdOrderByPrescribedDateDesc(
            Long patientId
    );

    long countByPatientId(Long patientId);

    void deleteByPatientId(Long patientId);
}