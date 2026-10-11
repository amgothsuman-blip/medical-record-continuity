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

import medical_record_backend.entity.Appointment;
import medical_record_backend.service.AppointmentService;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(
            AppointmentService appointmentService
    ) {
        this.appointmentService = appointmentService;
    }

    // GET appointments for a patient
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getPatientAppointments(
            @PathVariable Long patientId
    ) {
        try {
            List<Appointment> appointments =
                    appointmentService.getPatientAppointments(patientId);

            return ResponseEntity.ok(appointments);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // CREATE appointment
    @PostMapping("/patient/{patientId}")
    public ResponseEntity<?> createAppointment(
            @PathVariable Long patientId,
            @RequestBody Appointment appointment
    ) {
        try {
            Appointment savedAppointment =
                    appointmentService.createAppointment(
                            patientId,
                            appointment
                    );

            return ResponseEntity.ok(savedAppointment);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // DELETE appointment
    @DeleteMapping("/patient/{patientId}/{appointmentId}")
    public ResponseEntity<?> deleteAppointment(
            @PathVariable Long patientId,
            @PathVariable Long appointmentId
    ) {
        try {
            appointmentService.deleteAppointment(
                    appointmentId,
                    patientId
            );

            return ResponseEntity.ok(
                    "Appointment deleted successfully."
            );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}