import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PatientProfile() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    gender: "",
    bloodGroup: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==================== LOAD PATIENT ====================

  useEffect(() => {
    const storedPatient = sessionStorage.getItem("patient");

    if (storedPatient) {
      const parsedPatient = JSON.parse(storedPatient);

      setPatient(parsedPatient);

      setFormData({
        fullName: parsedPatient.fullName || "",
        dateOfBirth: parsedPatient.dateOfBirth || "",
        email: parsedPatient.email || "",
        phone: parsedPatient.phone || "",
        gender: parsedPatient.gender || "",
        bloodGroup: parsedPatient.bloodGroup || "",
        address: parsedPatient.address || "",
      });
    }

    setLoading(false);
  }, []);

  // ==================== HANDLE INPUT ====================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==================== EDIT PROFILE ====================

  const handleEdit = () => {
    setSuccess("");
    setError("");
    setEditMode(true);
  };

  // ==================== CANCEL EDIT ====================

  const handleCancel = () => {
    if (patient) {
      setFormData({
        fullName: patient.fullName || "",
        dateOfBirth: patient.dateOfBirth || "",
        email: patient.email || "",
        phone: patient.phone || "",
        gender: patient.gender || "",
        bloodGroup: patient.bloodGroup || "",
        address: patient.address || "",
      });
    }

    setError("");
    setSuccess("");
    setEditMode(false);
  };

  // ==================== SAVE PROFILE ====================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!patient) {
      setError("Patient information not available.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `https://medical-record-continuity.onrender.com/api/patients/${patient.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fullName: formData.fullName,
            dateOfBirth: formData.dateOfBirth,
            email: formData.email,
            phone: formData.phone,
            gender: formData.gender,
            bloodGroup: formData.bloodGroup,
            address: formData.address,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data === "string" ? data : "Unable to update profile.",
        );
      }

      setPatient(data);

      setFormData({
        fullName: data.fullName || "",
        dateOfBirth: data.dateOfBirth || "",
        email: data.email || "",
        phone: data.phone || "",
        gender: data.gender || "",
        bloodGroup: data.bloodGroup || "",
        address: data.address || "",
      });

      sessionStorage.setItem("patient", JSON.stringify(data));

      setSuccess("Profile updated successfully.");
      setEditMode(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ==================== DELETE ACCOUNT ====================

  const handleDeleteAccount = async () => {
    if (!patient) {
      setError("Patient information not available.");
      return;
    }

    const firstConfirmation = window.confirm(
      "WARNING!\n\nAre you sure you want to permanently delete your account?",
    );

    if (!firstConfirmation) {
      return;
    }

    const secondConfirmation = window.confirm(
      "This will permanently delete your profile and all associated medical records, lab reports, prescriptions, and appointments.\n\nThis action cannot be undone.\n\nContinue?",
    );

    if (!secondConfirmation) {
      return;
    }

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `https://medical-record-continuity.onrender.com/api/patients/${patient.id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data || "Unable to delete account.");
      }

      // Clear patient session
      sessionStorage.removeItem("patient");

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      setError(error.message);

      setDeleting(false);
    }
  };

  // ==================== LOADING ====================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-header">
          <div>
            <p className="dashboard-welcome">PATIENT PORTAL</p>

            <h1>Patient Profile</h1>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-empty-message">
            <strong>Loading patient information...</strong>
          </div>
        </div>
      </div>
    );
  }

  // ==================== NO PATIENT ====================

  if (!patient) {
    return (
      <div className="profile-page">
        <div className="profile-header">
          <div>
            <p className="dashboard-welcome">PATIENT PORTAL</p>

            <h1>Patient Profile</h1>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-empty-message">
            <strong>No patient information available</strong>

            <p>Please log in to view your patient information.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* ==================== HEADER ==================== */}

      <div className="profile-header">
        <div>
          <p className="dashboard-welcome">PATIENT PORTAL</p>

          <h1>Patient Profile</h1>

          <p className="profile-description">
            Your personal information from your medical record account.
          </p>
        </div>

        {!editMode ? (
          <button
            className="add-record-button"
            onClick={handleEdit}
            disabled={deleting}
          >
            Edit Profile
          </button>
        ) : (
          <button
            className="secondary-button"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </button>
        )}
      </div>

      {/* ==================== SUCCESS ==================== */}

      {success && <div className="success-message">{success}</div>}

      {/* ==================== ERROR ==================== */}

      {error && <div className="error-message">{error}</div>}

      {/* ==================== PROFILE CARD ==================== */}

      <div className="profile-card">
        <div className="profile-card-header">
          <h2>Personal Information</h2>

          <p>Information associated with your medical record account.</p>
        </div>

        {/* ==================== FORM ==================== */}

        <form className="profile-form" onSubmit={handleSubmit}>
          {/* ROW 1 */}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>

              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!editMode || saving}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>

              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={!editMode || saving}
                required
              />
            </div>
          </div>

          {/* ROW 2 */}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>

              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editMode || saving}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>

              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editMode || saving}
                required
              />
            </div>
          </div>

          {/* ROW 3 */}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gender">Gender</label>

              {editMode ? (
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="">Select Gender</option>

                  <option value="Male">Male</option>

                  <option value="Female">Female</option>

                  <option value="Other">Other</option>
                </select>
              ) : (
                <input
                  type="text"
                  id="gender"
                  value={formData.gender || "Not available"}
                  disabled
                />
              )}
            </div>

            <div className="form-group">
              <label htmlFor="bloodGroup">Blood Group</label>

              {editMode ? (
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="">Select Blood Group</option>

                  <option value="A+">A+</option>

                  <option value="A-">A-</option>

                  <option value="B+">B+</option>

                  <option value="B-">B-</option>

                  <option value="AB+">AB+</option>

                  <option value="AB-">AB-</option>

                  <option value="O+">O+</option>

                  <option value="O-">O-</option>
                </select>
              ) : (
                <input
                  type="text"
                  id="bloodGroup"
                  value={formData.bloodGroup || "Not available"}
                  disabled
                />
              )}
            </div>
          </div>

          {/* ADDRESS */}

          <div className="form-group">
            <label htmlFor="address">Address</label>

            <textarea
              id="address"
              name="address"
              rows="4"
              value={formData.address}
              onChange={handleChange}
              disabled={!editMode || saving}
              placeholder={editMode ? "Enter your address" : ""}
            />
          </div>

          {/* SAVE BUTTON */}

          {editMode && (
            <div className="profile-actions">
              <button
                type="submit"
                className="save-record-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* ==================== DANGER ZONE ==================== */}

      <div className="profile-card danger-zone">
        <div className="profile-card-header">
          <h2>Delete Account</h2>

          <p>
            Permanently delete your account and all associated medical
            information.
          </p>
        </div>

        <button
          type="button"
          className="delete-account-button"
          onClick={handleDeleteAccount}
          disabled={deleting || saving}
        >
          {deleting ? "Deleting Account..." : "Delete My Account"}
        </button>
      </div>
    </div>
  );
}

export default PatientProfile;
