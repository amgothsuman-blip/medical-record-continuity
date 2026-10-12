import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const [patient, setPatient] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    medicalRecords: 0,
    labReports: 0,
    prescriptions: 0,
    appointments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedPatient = sessionStorage.getItem("patient");

    if (!storedPatient) {
      setError("Please log in to view your dashboard.");
      setLoading(false);
      return;
    }

    const parsedPatient = JSON.parse(storedPatient);

    setPatient(parsedPatient);

    fetch(
      `https://medical-record-continuity.onrender.com/api/dashboard/patient/${parsedPatient.id}`,
    )
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            typeof data === "string" ? data : "Unable to load dashboard data.",
          );
        }

        return data;
      })
      .then((data) => {
        setDashboardData(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="dashboard-page">
      {/* ==================== SIDEBAR ==================== */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          Medical<span>Record</span>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="active">
            <span>▦</span>
            Dashboard
          </Link>

          <Link to="/medical-records">
            <span>Ⓜ</span>
            Medical Records
          </Link>

          <Link to="/prescriptions">
            <span>Rx</span>
            Prescriptions
          </Link>

          <Link to="/lab-reports">
            <span>⌁</span>
            Lab Reports
          </Link>

          <Link to="/appointments">
            <span>□</span>
            Appointments
          </Link>

          <Link to="/profile">
            <span>♙</span>
            Patient Profile
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <Link to="/">
            <span>↪</span>
            Logout
          </Link>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="dashboard-main">
        {/* ==================== HEADER ==================== */}
        <header className="dashboard-header">
          <div>
            <p className="dashboard-welcome">PATIENT PORTAL</p>

            <h1>Dashboard</h1>
          </div>

          <div className="patient-info">
            <div className="patient-avatar">
              {patient?.fullName
                ? patient.fullName.charAt(0).toUpperCase()
                : "P"}
            </div>

            <div>
              <strong>{patient?.fullName || "Patient"}</strong>

              <small>Account</small>
            </div>
          </div>
        </header>

        {/* ==================== ERROR ==================== */}

        {error && <div className="error-message">{error}</div>}

        {/* ==================== OVERVIEW ==================== */}

        <section className="overview-grid">
          {/* Medical Records */}

          <Link
            to="/medical-records"
            className="overview-card overview-card-link"
          >
            <div className="overview-icon">+</div>

            <div>
              <p>Medical Records</p>

              <h2>{loading ? "..." : dashboardData.medicalRecords}</h2>
            </div>
          </Link>

          {/* Prescriptions */}

          <Link
            to="/prescriptions"
            className="overview-card overview-card-link"
          >
            <div className="overview-icon">Rx</div>

            <div>
              <p>Prescriptions</p>

              <h2>{loading ? "..." : dashboardData.prescriptions}</h2>
            </div>
          </Link>

          {/* Lab Reports */}

          <Link to="/lab-reports" className="overview-card overview-card-link">
            <div className="overview-icon">✓</div>

            <div>
              <p>Lab Reports</p>

              <h2>{loading ? "..." : dashboardData.labReports}</h2>
            </div>
          </Link>

          {/* Appointments */}

          <Link to="/appointments" className="overview-card overview-card-link">
            <div className="overview-icon">+</div>

            <div>
              <p>Appointments</p>

              <h2>{loading ? "..." : dashboardData.appointments}</h2>
            </div>
          </Link>
        </section>

        {/* ==================== DASHBOARD CONTENT ==================== */}

        <section className="dashboard-content-grid">
          {/* ==================== MEDICAL RECORDS ==================== */}

          <div className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h2>Medical Records</h2>

                <p>Your medical history will appear here.</p>
              </div>

              <Link to="/medical-records">View</Link>
            </div>

            {loading ? (
              <div className="empty-state">
                <h3>Loading medical records...</h3>
              </div>
            ) : dashboardData.medicalRecords === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">+</div>

                <h3>No medical records available</h3>

                <p>
                  Medical records added through the healthcare system will
                  appear here.
                </p>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">✓</div>

                <h3>
                  {dashboardData.medicalRecords} medical record
                  {dashboardData.medicalRecords !== 1 ? "s" : ""} available
                </h3>

                <p>You have medical records available in your account.</p>

                <Link to="/medical-records">View Medical Records</Link>
              </div>
            )}
          </div>

          {/* ==================== HEALTH INFORMATION ==================== */}

          <div className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h2>Health Information</h2>

                <p>Access your healthcare information.</p>
              </div>
            </div>

            {/* Medical Records */}

            <Link to="/medical-records" className="quick-action">
              <span>+</span>

              <div>
                <strong>Medical Records</strong>

                <small>
                  {dashboardData.medicalRecords} record
                  {dashboardData.medicalRecords !== 1 ? "s" : ""}
                </small>
              </div>
            </Link>

            {/* Prescriptions */}

            <Link to="/prescriptions" className="quick-action">
              <span>Rx</span>

              <div>
                <strong>Prescriptions</strong>

                <small>
                  {dashboardData.prescriptions} prescription
                  {dashboardData.prescriptions !== 1 ? "s" : ""}
                </small>
              </div>
            </Link>

            {/* Lab Reports */}

            <Link to="/lab-reports" className="quick-action">
              <span>⌁</span>

              <div>
                <strong>Lab Reports</strong>

                <small>
                  {dashboardData.labReports} report
                  {dashboardData.labReports !== 1 ? "s" : ""}
                </small>
              </div>
            </Link>

            {/* Appointments */}

            <Link to="/appointments" className="quick-action">
              <span>□</span>

              <div>
                <strong>Appointments</strong>

                <small>
                  {dashboardData.appointments} appointment
                  {dashboardData.appointments !== 1 ? "s" : ""}
                </small>
              </div>
            </Link>

            {/* Patient Profile */}

            <Link to="/profile" className="quick-action">
              <span>♙</span>

              <div>
                <strong>Patient Profile</strong>

                <small>View your personal information</small>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
