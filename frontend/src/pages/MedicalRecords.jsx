import { useEffect, useState } from "react";

function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    recordDate: "",
    diagnosis: "",
    description: "",
    doctorName: "",
    hospitalName: "",
  });

  const storedPatient = sessionStorage.getItem("patient");
  const patient = storedPatient ? JSON.parse(storedPatient) : null;

  // Load medical records
  const loadRecords = () => {
    if (!patient) {
      setError("Please log in to view your medical records.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    fetch(
      `http://localhost:8080/api/medical-records/patient/${patient.id}`
    )
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            typeof data === "string"
              ? data
              : "Unable to load medical records."
          );
        }

        return data;
      })
      .then((data) => {
        setRecords(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadRecords();
  }, []);

  // Handle form input
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Add medical record
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!patient) {
      setError("Please log in first.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/medical-records/patient/${patient.id}`,
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
            : "Unable to save medical record."
        );
      }

      setSuccess("Medical record added successfully.");

      setFormData({
        recordDate: "",
        diagnosis: "",
        description: "",
        doctorName: "",
        hospitalName: "",
      });

      setShowForm(false);

      loadRecords();
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete medical record
  const handleDelete = async (recordId) => {
    if (!patient) {
      setError("Please log in first.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this medical record?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(recordId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/medical-records/patient/${patient.id}/${recordId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.text();

      if (!response.ok) {
        throw new Error(
          data || "Unable to delete medical record."
        );
      }

      setSuccess("Medical record deleted successfully.");

      // Remove deleted record immediately from the screen
      setRecords((previousRecords) =>
        previousRecords.filter(
          (record) => record.id !== recordId
        )
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="records-page">

      {/* Header */}

      <div className="records-header">

        <div>
          <p className="dashboard-welcome">
            PATIENT PORTAL
          </p>

          <h1>Medical Records</h1>

          <p className="records-description">
            View your medical history and healthcare records.
          </p>
        </div>

        <button
          type="button"
          className="add-record-button"
          onClick={() => {
            setShowForm(!showForm);
            setSuccess("");
            setError("");
          }}
        >
          {showForm
            ? "Cancel"
            : "+ Add Medical Record"}
        </button>

      </div>

      {/* Add Medical Record Form */}

      {showForm && (
        <div className="records-card add-record-card">

          <div className="records-card-header">

            <div>
              <h2>Add Medical Record</h2>

              <p>
                Enter the medical record details below.
              </p>
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Record Date</label>

              <input
                type="date"
                name="recordDate"
                value={formData.recordDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Diagnosis</label>

              <input
                type="text"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                placeholder="Enter diagnosis"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter medical details"
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

            <div className="form-group">
              <label>Hospital Name</label>

              <input
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                placeholder="Enter hospital name"
              />
            </div>

            <button
              type="submit"
              className="save-record-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Medical Record"}
            </button>

          </form>

        </div>
      )}

      {/* Success Message */}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {/* Error Message */}

      {error && !loading && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Medical Records */}

      <div className="records-card">

        <div className="records-card-header">

          <div>
            <h2>Medical History</h2>

            <p>
              Medical records retrieved from your
              healthcare providers will appear here.
            </p>
          </div>

        </div>

        {loading && (
          <div className="records-empty-state">
            <h3>
              Loading medical records...
            </h3>
          </div>
        )}

        {!loading &&
          !error &&
          records.length === 0 && (
            <div className="records-empty-state">

              <div className="records-empty-icon">
                +
              </div>

              <h3>
                No medical records available
              </h3>

              <p>
                There are currently no medical
                records available for this account.
              </p>

            </div>
          )}

        {!loading &&
          records.length > 0 && (
            <div className="medical-record-list">

              {records.map((record) => (
                <div
                  className="medical-record-item"
                  key={record.id}
                >

                  <div>
                    <strong>
                      {record.diagnosis}
                    </strong>

                    <p>
                      {record.description ||
                        "No description available."}
                    </p>
                  </div>

                  <div>
                    <small>
                      Record Date
                    </small>

                    <p>
                      {record.recordDate}
                    </p>
                  </div>

                  <div>
                    <small>
                      Doctor
                    </small>

                    <p>
                      {record.doctorName ||
                        "Not available"}
                    </p>
                  </div>

                  <div>
                    <small>
                      Hospital
                    </small>

                    <p>
                      {record.hospitalName ||
                        "Not available"}
                    </p>
                  </div>

                  {/* Delete */}

                  <div>
                    <button
                      type="button"
                      className="delete-record-button"
                      onClick={() =>
                        handleDelete(record.id)
                      }
                      disabled={
                        deletingId === record.id
                      }
                    >
                      {deletingId === record.id
                        ? "Deleting..."
                        : "Delete"}
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

export default MedicalRecords;