import { useEffect, useState } from "react";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    appointmentDate: "",
    appointmentTime: "",
    doctorName: "",
    hospitalName: "",
    department: "",
    reason: "",
    status: "Scheduled",
  });

  const loadAppointments = async () => {
    const storedPatient = sessionStorage.getItem("patient");

    if (!storedPatient) {
      setError("Please log in to view your appointments.");
      setLoading(false);
      return;
    }

    const patient = JSON.parse(storedPatient);

    try {
      const response = await fetch(
        `http://localhost:8080/api/appointments/patient/${patient.id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : "Unable to load appointments."
        );
      }

      setAppointments(data);
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const storedPatient = sessionStorage.getItem("patient");

    if (!storedPatient) {
      setError("Please log in first.");
      return;
    }

    const patient = JSON.parse(storedPatient);

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `http://localhost:8080/api/appointments/patient/${patient.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : "Unable to save appointment."
        );
      }

      setSuccess("Appointment added successfully.");

      setFormData({
        appointmentDate: "",
        appointmentTime: "",
        doctorName: "",
        hospitalName: "",
        department: "",
        reason: "",
        status: "Scheduled",
      });

      setShowForm(false);

      await loadAppointments();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (appointmentId) => {
    const storedPatient = sessionStorage.getItem("patient");

    if (!storedPatient) {
      setError("Please log in first.");
      return;
    }

    const patient = JSON.parse(storedPatient);

    const confirmed = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `http://localhost:8080/api/appointments/patient/${patient.id}/${appointmentId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.text();

      if (!response.ok) {
        throw new Error(
          data || "Unable to delete appointment."
        );
      }

      setAppointments((previous) =>
        previous.filter(
          (appointment) => appointment.id !== appointmentId
        )
      );

      setSuccess("Appointment deleted successfully.");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="records-page">

      {/* ==================== HEADER ==================== */}

      <div className="records-header">

        <div>

          <p className="dashboard-welcome">
            PATIENT PORTAL
          </p>

          <h1>
            Appointments
          </h1>

          <p className="records-description">
            View your scheduled medical appointments.
          </p>

        </div>

        <button
          className="add-record-button"
          onClick={() => {
            setShowForm(true);
            setError("");
            setSuccess("");
          }}
        >
          + Add Appointment
        </button>

      </div>


      {/* ==================== SUCCESS ==================== */}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}


      {/* ==================== ERROR ==================== */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* ==================== ADD FORM ==================== */}

      {showForm && (

        <div className="records-card">

          <div className="records-card-header">

            <div>

              <h2>
                Add Appointment
              </h2>

              <p>
                Enter the appointment details below.
              </p>

            </div>

            <button
              className="secondary-button"
              onClick={() => {
                setShowForm(false);
                setError("");
              }}
            >
              Cancel
            </button>

          </div>


          <form
            className="record-form"
            onSubmit={handleSubmit}
          >

            {/* DATE */}

            <div className="form-group">

              <label>
                Appointment Date
              </label>

              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                required
              />

            </div>


            {/* TIME */}

            <div className="form-group">

              <label>
                Appointment Time
              </label>

              <input
                type="time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
              />

            </div>


            {/* DOCTOR */}

            <div className="form-group">

              <label>
                Doctor Name
              </label>

              <input
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                placeholder="Enter doctor name"
                required
              />

            </div>


            {/* HOSPITAL */}

            <div className="form-group">

              <label>
                Hospital Name
              </label>

              <input
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                placeholder="Enter hospital name"
              />

            </div>


            {/* DEPARTMENT */}

            <div className="form-group">

              <label>
                Department
              </label>

              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Example: Cardiology"
              />

            </div>


            {/* REASON */}

            <div className="form-group">

              <label>
                Reason
              </label>

              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Enter reason for appointment"
                rows="4"
              />

            </div>


            {/* STATUS */}

            <div className="form-group">

              <label>
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Scheduled">
                  Scheduled
                </option>

                <option value="Confirmed">
                  Confirmed
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>

            </div>


            {/* SAVE */}

            <button
              type="submit"
              className="save-record-button"
            >
              Save Appointment
            </button>

          </form>

        </div>

      )}


      {/* ==================== APPOINTMENTS CARD ==================== */}

      <div className="records-card">

        <div className="records-card-header">

          <div>

            <h2>
              Appointments
            </h2>

            <p>
              Scheduled appointments retrieved from your
              healthcare providers will appear here.
            </p>

          </div>

        </div>


        {/* ==================== LOADING ==================== */}

        {loading && (

          <div className="records-empty-state">

            <h3>
              Loading appointments...
            </h3>

          </div>

        )}


        {/* ==================== NO APPOINTMENTS ==================== */}

        {!loading &&
          !error &&
          appointments.length === 0 && (

            <div className="records-empty-state">

              <div className="records-empty-icon">
                □
              </div>

              <h3>
                No appointments available
              </h3>

              <p>
                There are currently no appointments available
                for this account.
              </p>

            </div>

          )}


        {/* ==================== APPOINTMENT LIST ==================== */}

        {!loading &&
          appointments.length > 0 && (

            <div className="medical-record-list">

              {appointments.map((appointment) => (

                <div
                  className="medical-record-item"
                  key={appointment.id}
                >

                  <div>

                    <strong>
                      {appointment.doctorName}
                    </strong>

                    <p>
                      {appointment.department ||
                        "Medical Appointment"}
                    </p>

                  </div>


                  <div>

                    <small>
                      Appointment Date
                    </small>

                    <p>
                      {appointment.appointmentDate}
                    </p>

                  </div>


                  <div>

                    <small>
                      Appointment Time
                    </small>

                    <p>
                      {appointment.appointmentTime}
                    </p>

                  </div>


                  <div>

                    <small>
                      Hospital
                    </small>

                    <p>
                      {appointment.hospitalName ||
                        "Not available"}
                    </p>

                  </div>


                  <div>

                    <small>
                      Status
                    </small>

                    <p>
                      {appointment.status ||
                        "Not available"}
                    </p>

                  </div>


                  <div>

                    <small>
                      Reason
                    </small>

                    <p>
                      {appointment.reason ||
                        "Not available"}
                    </p>

                  </div>


                  {/* DELETE */}

                  <div>

                    <button
                      className="delete-record-button"
                      onClick={() =>
                        handleDelete(appointment.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

      </div>

    </div>
  );
}

export default Appointments;