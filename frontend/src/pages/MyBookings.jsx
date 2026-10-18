import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok) {
          setError(data.message || "Failed to load bookings.");
          return;
        }

        setBookings(data.bookings);
      } catch (error) {
        console.error("Fetch bookings error:", error);
        setError("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const handleCancel = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(bookingId);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        alert(data.message || "Could not cancel booking.");
        return;
      }

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking._id === bookingId ? data.booking : booking
        )
      );

      alert("Booking cancelled successfully!");
    } catch (error) {
      console.error("Cancel booking error:", error);
      alert("Could not connect to the server.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link className="brand auth-brand" to="/dashboard">
          <span className="brand-icon">⌂</span>
          <span>
            Fix<span className="brand-highlight">Mate</span>
          </span>
        </Link>

        <span className="eyebrow">YOUR BOOKINGS</span>
        <h1>My Bookings</h1>

        <p className="auth-description">
          Keep track of your home service requests.
        </p>

        {loading && <p>Loading your bookings...</p>}

        {!loading && error && <p>{error}</p>}

        {!loading && !error && bookings.length === 0 && (
          <p>You haven't booked any services yet.</p>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="my-bookings-list">
            {bookings.map((booking) => (
              <div className="my-booking-card" key={booking._id}>
                <h3>{booking.service}</h3>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(booking.date).toLocaleDateString("en-IN")}
                </p>

                <p>
                  <strong>Address:</strong> {booking.address}
                </p>

                <p>
                  <strong>Status:</strong> {booking.status}
                </p>

                {booking.status === "Pending" && (
                  <button
                    className="back-home"
                    onClick={() => handleCancel(booking._id)}
                    disabled={cancellingId === booking._id}
                  >
                    {cancellingId === booking._id
                      ? "Cancelling..."
                      : "Cancel Booking"}
                  </button>
                )}

                {booking.details && <p>{booking.details}</p>}
              </div>
            ))}
          </div>
        )}

        <Link className="back-home" to="/dashboard">
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}

export default MyBookings;