import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../index.css";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login", { replace: true });
          return;
        }

        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (error) {
        console.error("Authentication check failed:", error);
        // Network failure ko invalid token nahi maanenge.
        // User ko error dikhayenge, taaki server restart karke retry kar sake.
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    verifyUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  if (checkingAuth) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p>Verifying your login...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2>Unable to verify your login</h2>
          <p>Please check that the FixMate backend is running.</p>
          <button
            className="primary-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
          <button className="back-home" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link className="brand auth-brand" to="/">
          <span className="brand-icon">⌂</span>
          <span>
            Fix<span className="brand-highlight">Mate</span>
          </span>
        </Link>

        <span className="eyebrow">YOUR FIXMATE SPACE</span>

        <h1>Welcome{user.name ? `, ${user.name}` : " to FixMate"}!</h1>

        <p className="auth-description">
          You're logged in successfully. Your home services journey starts here.
        </p>

        <section className="dashboard-services">
          <h2>What do you need help with?</h2>
          <p>Choose a service for your home.</p>

          <div className="service-grid">
            <Link to="/booking?service=Plumbing" className="service-card">
              <span className="service-icon">🔧</span>
              <h3>Plumbing</h3>
              <p>Fix leaks and taps</p>
            </Link>

            <Link to="/booking?service=Electrical" className="service-card">
              <span className="service-icon">⚡</span>
              <h3>Electrical</h3>
              <p>Repairs and installations</p>
            </Link>

            <Link to="/booking?service=AC%20Repair" className="service-card">
              <span className="service-icon">❄️</span>
              <h3>AC Repair</h3>
              <p>Cooling and maintenance</p>
            </Link>

            <Link to="/booking?service=Cleaning" className="service-card">
              <span className="service-icon">🧹</span>
              <h3>Cleaning</h3>
              <p>Keep your home fresh</p>
            </Link>
          </div>
        </section>

        <div className="auth-form">
          <Link className="primary-button" to="/">
            Explore Services →
          </Link>
        </div>

        <div className="auth-form">
          <Link className="primary-button" to="/my-bookings">
            My Bookings →
          </Link>
        </div>

        <button className="back-home" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
