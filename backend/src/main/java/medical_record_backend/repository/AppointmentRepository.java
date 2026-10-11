package medical_record_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import medical_record_backend.entity.Appointment;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    List<Appointment>
    findByPatientIdOrderByAppointmentDateAscAppointmentTimeAsc(
            Long patientId
    );

    long countByPatientId(Long patientId);

    void deleteByPatientId(Long patientId);
}