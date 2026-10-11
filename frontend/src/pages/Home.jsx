import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="logo">
          Medical<span>Record</span>
        </div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register" className="register-btn">
            Register
          </Link>
        </div>
      </nav>

      <main className="hero-section">
        <div className="hero-content">
          <p className="welcome-text">WELCOME TO OUR PLATFORM</p>

          <h1>
            Your Medical Records,
            <br />
            <span>Connected & Secure.</span>
          </h1>

          <p className="hero-description">
            A centralized platform to securely manage, access, and maintain
            your medical records across healthcare providers.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="primary-btn">
              Login
            </Link>

            <Link to="/register" className="secondary-btn">
              Create Account
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="card-icon">+</div>
          <h2>Medical Records</h2>
          <p>
            Keep your health information organized and accessible when you
            need it.
          </p>

          <div className="record-item">
            <span>Patient Records</span>
            <span>✓</span>
          </div>

          <div className="record-item">
            <span>Prescriptions</span>
            <span>✓</span>
          </div>

          <div className="record-item">
            <span>Lab Reports</span>
            <span>✓</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;