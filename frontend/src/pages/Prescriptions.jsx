import { useEffect, useState } from "react";

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    medicineName: "",
    dosage: "",
    frequency: "",
    prescribedDate: "",
    instructions: "",
    doctorName: "",
  });

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    const storedPatient = sessionStorage.getItem("patient");

    if (!storedPatient) {
      setError("Please log in to view your prescriptions.");
      setLoading(false);
      return;
    }

    const patient = JSON.parse(storedPatient);

    try {
      const response = await fetch(
        `http://localhost:8080/api/prescriptions/patient/${patient.id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : "Unable to load prescriptions."
        );
      }

      setPrescriptions(data);
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
        `http://localhost:8080/api/prescriptions/patient/${patient.id}`,
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
            : "Unable to save prescription."
        );
      }

      setSuccess("Prescription added successfully.");

      setFormData({
        medicineName: "",
        dosage: "",
        frequency: "",
        prescribedDate: "",
        instructions: "",
        doctorName: "",
      });

      setShowForm(false);

      await loadPrescriptions();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (prescriptionId) => {
    const storedPatient = sessionStorage.getItem("patient");

    if (!storedPatient) {
      setError("Please log in first.");
      return;
    }

    const patient = JSON.parse(storedPatient);

    const confirmed = window.confirm(
      "Are you sure you want to delete this prescription?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `http://localhost:8080/api/prescriptions/patient/${patient.id}/${prescriptionId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.text();

      if (!response.ok) {
        throw new Error(
          data || "Unable to delete prescription."
        );
      }

      setPrescriptions((previous) =>
        previous.filter(
          (prescription) => prescription.id !== prescriptionId
        )
      );

      setSuccess("Prescription deleted successfully.");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="records-page">

      <div className="records-header">

        <div>
          <p className="dashboard-welcome">
            PATIENT PORTAL
          </p>

          <h1>Prescriptions</h1>

          <p className="records-description">
            View and manage prescriptions associated with your
            medical records.
          </p>
        </div>

        <button
          className="add-record-button"
          onClick={() => {
            setShowForm(true);
            setSuccess("");
            setError("");
          }}
        >
          + Add Prescription
        </button>

      </div>

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showForm && (
        <div className="records-card">

          <div className="records-card-header">

            <div>
              <h2>Add Prescription</h2>

              <p>
                Enter the prescription details below.
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

            <div className="form-group">
              <label>Medicine Name</label>

              <input
                type="text"
                name="medicineName"
                value={formData.medicineName}
                onChange={handleChange}
                placeholder="Enter medicine name"
                required
              />
            </div>

            <div className="form-group">
              <label>Dosage</label>

              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                placeholder="Example: 500 mg"
              />
            </div>

            <div className="form-group">
              <label>Frequency</label>

              <input
                type="text"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                placeholder="Example: Twice daily"
              />
            </div>

            <div className="form-group">
              <label>Prescribed Date</label>

              <input
                type="date"
                name="prescribedDate"
                value={formData.prescribedDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Instructions</label>

              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                placeholder="Enter instructions"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Doctor Name</label>

              <input
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                placeholder="Enter doctor name"
              />
            </div>

            <button
              type="submit"
              className="save-record-button"
            >
              Save Prescription
            </button>

          </form>

        </div>
      )}

      <div className="records-card">

        <div className="records-card-header">

          <div>
            <h2>Prescriptions</h2>

            <p>
              Prescriptions retrieved from your healthcare
              providers will appear here.
            </p>
          </div>

        </div>

        {loading && (
          <div className="records-empty-state">
            <h3>Loading prescriptions...</h3>
          </div>
        )}

        {!loading &&
          !error &&
          prescriptions.length === 0 && (
            <div className="records-empty-state">

              <div className="records-empty-icon">
                +
              </div>

              <h3>No prescriptions available</h3>

              <p>
                There are currently no prescriptions available
                for this account.
              </p>

            </div>
          )}

        {!loading &&
          prescriptions.length > 0 && (
            <div className="medical-record-list">

              {prescriptions.map((prescription) => (

                <div
                  className="medical-record-item"
                  key={prescription.id}
                >

                  <div>
                    <small>Medicine</small>

                    <strong>
                      {prescription.medicineName}
                    </strong>
                  </div>

                  <div>
                    <small>Dosage</small>

                    <p>
                      {prescription.dosage || "Not available"}
                    </p>
                  </div>

                  <div>
                    <small>Frequency</small>

                    <p>
                      {prescription.frequency || "Not available"}
                    </p>
                  </div>

                  <div>
                    <small>Prescribed Date</small>

                    <p>
                      {prescription.prescribedDate}
                    </p>
                  </div>

                  <div>
                    <small>Doctor</small>

                    <p>
                      {prescription.doctorName || "Not available"}
                    </p>
                  </div>

                  <div>
                    <small>Instructions</small>

                    <p>
                      {prescription.instructions || "Not available"}
                    </p>
                  </div>

                  <div>
                    <button
                      className="delete-record-button"
                      onClick={() =>
                        handleDelete(prescription.id)
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

export default Prescriptions;