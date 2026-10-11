package medical_record_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import medical_record_backend.entity.Patient;
import medical_record_backend.service.PatientService;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }


    // ==================== REGISTER ====================

    @PostMapping("/register")
    public ResponseEntity<?> registerPatient(
            @RequestBody Patient patient
    ) {

        try {

            Patient registeredPatient =
                    patientService.registerPatient(patient);

            // Never send password to frontend
            registeredPatient.setPassword(null);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(registeredPatient);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // ==================== LOGIN ====================

    @PostMapping("/login")
    public ResponseEntity<?> loginPatient(
            @RequestBody LoginRequest request
    ) {

        try {

            Patient patient =
                    patientService.loginPatient(
                            request.getEmail(),
                            request.getPassword()
                    );

            // Never send password to frontend
            patient.setPassword(null);

            return ResponseEntity.ok(patient);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }


    // ==================== UPDATE PROFILE ====================

    @PutMapping("/{patientId}")
    public ResponseEntity<?> updatePatient(
            @PathVariable Long patientId,
            @RequestBody Patient updatedPatient
    ) {

        try {

            Patient updated =
                    patientService.updatePatient(
                            patientId,
                            updatedPatient
                    );

            // Never send password to frontend
            updated.setPassword(null);

            return ResponseEntity.ok(updated);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // ==================== DELETE ACCOUNT ====================

    @DeleteMapping("/{patientId}")
    public ResponseEntity<?> deletePatient(
            @PathVariable Long patientId
    ) {

        try {

            patientService.deletePatient(patientId);

            return ResponseEntity.ok(
                    "Patient account deleted successfully."
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // ==================== LOGIN REQUEST ====================

    public static class LoginRequest {

        private String email;
        private String password;


        public String getEmail() {
            return email;
        }


        public void setEmail(String email) {
            this.email = email;
        }


        public String getPassword() {
            return password;
        }


        public void setPassword(String password) {
            this.password = password;
        }
    }
}