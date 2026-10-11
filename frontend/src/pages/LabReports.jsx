import { useEffect, useState } from "react";

function LabReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    testName: "",
    reportDate: "",
    result: "",
    referenceRange: "",
    remarks: "",
    laboratoryName: "",
  });

  const storedPatient = sessionStorage.getItem("patient");
  const patient = storedPatient
    ? JSON.parse(storedPatient)
    : null;

  // Load laboratory reports
  const loadReports = () => {
    if (!patient) {
      setError("Please log in to view your laboratory reports.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    fetch(
      `http://localhost:8080/api/lab-reports/patient/${patient.id}`
    )
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            typeof data === "string"
              ? data
              : "Unable to load laboratory reports."
          );
        }

        return data;
      })
      .then((data) => {
        setReports(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadReports();
  }, []);

  // Handle form input
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Add laboratory report
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
        `http://localhost:8080/api/lab-reports/patient/${patient.id}`,
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
            : "Unable to save laboratory report."
        );
      }

      setSuccess("Laboratory report added successfully.");

      setFormData({
        testName: "",
        reportDate: "",
        result: "",
        referenceRange: "",
        remarks: "",
        laboratoryName: "",
      });

      setShowForm(false);

      loadReports();
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete laboratory report
  const handleDelete = async (reportId) => {
    if (!patient) {
      setError("Please log in first.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this laboratory report?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(reportId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/lab-reports/patient/${patient.id}/${reportId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.text();

      if (!response.ok) {
        throw new Error(
          data || "Unable to delete laboratory report."
        );
      }

      setSuccess("Laboratory report deleted successfully.");

      setReports((previousReports) =>
        previousReports.filter(
          (report) => report.id !== reportId
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

          <h1>Lab Reports</h1>

          <p className="records-description">
            View laboratory reports associated with your medical records.
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
            : "+ Add Lab Report"}
        </button>

      </div>

      {/* Add Lab Report Form */}

      {showForm && (
        <div className="records-card add-record-card">

          <div className="records-card-header">

            <div>
              <h2>Add Laboratory Report</h2>

              <p>
                Enter the laboratory report details below.
              </p>
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Test Name</label>

              <input
                type="text"
                name="testName"
                value={formData.testName}
                onChange={handleChange}
                placeholder="Enter test name"
                required
              />
            </div>

            <div className="form-group">
              <label>Report Date</label>

              <input
                type="date"
                name="reportDate"
                value={formData.reportDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Result</label>

              <textarea
                name="result"
                value={formData.result}
                onChange={handleChange}
                placeholder="Enter test result"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Reference Range</label>

              <input
                type="text"
                name="referenceRange"
                value={formData.referenceRange}
                onChange={handleChange}
                placeholder="Example: 70 - 100 mg/dL"
              />
            </div>

            <div className="form-group">
              <label>Laboratory Name</label>

              <input
                type="text"
                name="laboratoryName"
                value={formData.laboratoryName}
                onChange={handleChange}
                placeholder="Enter laboratory name"
              />
            </div>

            <div className="form-group">
              <label>Remarks</label>

              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Enter remarks"
                rows="3"
              />
            </div>

            <button
              type="submit"
              className="save-record-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Lab Report"}
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

      {/* Laboratory Reports */}

      <div className="records-card">

        <div className="records-card-header">

          <div>
            <h2>Laboratory Reports</h2>

            <p>
              Laboratory reports retrieved from your healthcare providers
              will appear here.
            </p>
          </div>

        </div>

        {loading && (
          <div className="records-empty-state">
            <h3>
              Loading laboratory reports...
            </h3>
          </div>
        )}

        {!loading &&
          !error &&
          reports.length === 0 && (
            <div className="records-empty-state">

              <div className="records-empty-icon">
                ⌁
              </div>

              <h3>
                No laboratory reports available
              </h3>

              <p>
                There are currently no laboratory reports available
                for this account.
              </p>

            </div>
          )}

        {!loading &&
          reports.length > 0 && (
            <div className="medical-record-list">

              {reports.map((report) => (
                <div
                  className="medical-record-item"
                  key={report.id}
                >

                  <div>
                    <small>Test</small>

                    <strong>
                      {report.testName}
                    </strong>
                  </div>

                  <div>
                    <small>Report Date</small>

                    <p>
                      {report.reportDate}
                    </p>
                  </div>

                  <div>
                    <small>Result</small>

                    <p>
                      {report.result || "Not available"}
                    </p>
                  </div>

                  <div>
                    <small>Reference Range</small>

                    <p>
                      {report.referenceRange ||
                        "Not available"}
                    </p>
                  </div>

                  <div>
                    <small>Laboratory</small>

                    <p>
                      {report.laboratoryName ||
                        "Not available"}
                    </p>
                  </div>

                  <div>
                    <small>Remarks</small>

                    <p>
                      {report.remarks ||
                        "Not available"}
                    </p>
                  </div>

                  {/* Delete */}

                  <div>
                    <button
                      type="button"
                      className="delete-record-button"
                      onClick={() =>
                        handleDelete(report.id)
                      }
                      disabled={
                        deletingId === report.id
                      }
                    >
                      {deletingId === report.id
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

export default LabReports;