package medical_record_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import medical_record_backend.entity.Appointment;
import medical_record_backend.entity.Patient;
import medical_record_backend.repository.AppointmentRepository;
import medical_record_backend.repository.PatientRepository;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            PatientRepository patientRepository
    ) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
    }

    // GET appointments for a patient
    public List<Appointment> getPatientAppointments(Long patientId) {

        if (!patientRepository.existsById(patientId)) {
            throw new RuntimeException("Patient not found");
        }

        return appointmentRepository
                .findByPatientIdOrderByAppointmentDateAscAppointmentTimeAsc(
                        patientId
                );
    }

    // CREATE a new appointment
    public Appointment createAppointment(
            Long patientId,
            Appointment appointment
    ) {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found")
                );

        appointment.setId(null);
        appointment.setPatient(patient);

        return appointmentRepository.save(appointment);
    }

    // DELETE an appointment
    public void deleteAppointment(
            Long appointmentId,
            Long patientId
    ) {

        Appointment appointment = appointmentRepository
                .findById(appointmentId)
                .orElseThrow(() ->
                        new RuntimeException("Appointment not found")
                );

        // Make sure the appointment belongs to this patient
        if (!appointment.getPatient().getId().equals(patientId)) {
            throw new RuntimeException(
                    "You are not authorized to delete this appointment"
            );
        }

        appointmentRepository.deleteById(appointmentId);
    }
}