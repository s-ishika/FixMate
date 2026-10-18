
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/bookings";

const STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"];

function AdminDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [statusChanges, setStatusChanges] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
          setError("You do not have permission to access the Admin Panel.");
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "Failed to load bookings.");
        }

        setBookings(data.bookings || []);

        const initialStatuses = {};
        (data.bookings || []).forEach((booking) => {
          initialStatuses[booking._id] = booking.status;
        });

        setStatusChanges(initialStatuses);
      } catch (err) {
        setError(err.message || "Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const handleStatusChange = (bookingId, status) => {
    setStatusChanges((previous) => ({
      ...previous,
      [bookingId]: status,
    }));
  };

  const updateStatus = async (bookingId) => {
    const token = localStorage.getItem("token");
    const newStatus = statusChanges[bookingId];

    setError("");
    setSavingId(bookingId);

    try {
      const response = await fetch(
        `${API_URL}/admin/${bookingId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (response.status === 403) {
        setError("Admin permission is required to update bookings.");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status.");
      }

      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: data.booking.status }
            : booking
        )
      );

      alert("Booking status updated successfully!");
    } catch (err) {
      setError(err.message || "Unable to update booking status.");
    } finally {
      setSavingId("");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const countByStatus = (status) =>
    bookings.filter((booking) => booking.status === status).length;

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-message">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-navbar">
        <Link to="/" className="brand">
          <span className="brand-icon">⌂</span>
          <span>
            Fix<span className="brand-highlight">Mate</span>
          </span>
        </Link>

        <div className="admin-nav-actions">
          <span className="admin-label">Admin Panel</span>
          <button className="admin-secondary-button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="admin-container">
        <div className="admin-heading">
          <div>
            <p className="eyebrow">MANAGE YOUR PLATFORM</p>
            <h1>Admin Dashboard</h1>
            <p>View service bookings and manage their status.</p>
          </div>

          <Link to="/dashboard" className="admin-back-link">
            User Dashboard
          </Link>
        </div>

        {error && (
          <div className="admin-error" role="alert">
            {error}
          </div>
        )}

        <section className="admin-stats">
          <article className="admin-stat-card">
            <span>Total Bookings</span>
            <strong>{bookings.length}</strong>
          </article>

          <article className="admin-stat-card">
            <span>Pending</span>
            <strong>{countByStatus("Pending")}</strong>
          </article>

          <article className="admin-stat-card">
            <span>Confirmed</span>
            <strong>{countByStatus("Confirmed")}</strong>
          </article>

          <article className="admin-stat-card">
            <span>Completed</span>
            <strong>{countByStatus("Completed")}</strong>
          </article>
        </section>

        <section className="admin-bookings-section">
          <div className="admin-section-heading">
            <div>
              <h2>All Service Bookings</h2>
              <p>Review customer details and update booking status.</p>
            </div>

            <button
              className="admin-secondary-button"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
          </div>

          {bookings.length === 0 ? (
            <p className="admin-message">No bookings found yet.</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>
                        <strong>{booking.user?.name || "Unknown"}</strong>
                        <span className="admin-customer-email">
                          {booking.user?.email || "No email"}
                        </span>
                      </td>

                      <td>{booking.service}</td>

                      <td>
                        {new Date(booking.date).toLocaleDateString("en-IN")}
                      </td>

                      <td className="admin-address">
                        {booking.address}
                      </td>

                      <td>
                        <span
                          className={`admin-status admin-status-${booking.status.toLowerCase()}`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      <td>
                        <div className="admin-status-actions">
                          <select
                            aria-label={`Status for ${booking.service} booking`}
                            value={
                              statusChanges[booking._id] || booking.status
                            }
                            onChange={(event) =>
                              handleStatusChange(
                                booking._id,
                                event.target.value
                              )
                            }
                          >
                            {STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>

                          <button
                            className="primary-button admin-save-button"
                            disabled={
                              savingId === booking._id ||
                              statusChanges[booking._id] === booking.status
                            }
                            onClick={() => updateStatus(booking._id)}
                          >
                            {savingId === booking._id ? "Saving..." : "Save"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <Link to="/" className="admin-home-link">
          ← Back to FixMate Home
        </Link>
      </main>
    </div>
  );
}

export default AdminDashboard;
