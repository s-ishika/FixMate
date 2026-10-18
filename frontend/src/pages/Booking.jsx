
import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import "../index.css";

function Booking() {
  const [searchParams] = useSearchParams();
  const selectedService = searchParams.get("service") || "Plumbing";
  const navigate = useNavigate();
  
  const [service, setService] = useState(selectedService);
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);



const handleSubmit = async (event) => {
  event.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please log in first to book a service.");
    navigate("/login");
    return;
  }

  const cleanAddress = address.trim();
  const cleanDetails = details.trim();

  if (!cleanAddress) {
    alert("Please enter your complete service address.");
    return;
  }

  if (!date || date < new Date().toLocaleDateString("en-CA")) {
    alert("Please select today or a future date.");
    return;
  }

  if (isSubmitting) return;

  setIsSubmitting(true);

  try {
    const response = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        service,
        address: cleanAddress,
        date,
        details: cleanDetails,
      }),
    });

    const data = await response.json();

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert("Your session has expired. Please log in again.");
      navigate("/login");
      return;
    }

    if (!response.ok) {
      alert(data.message || "Booking failed. Please try again.");
      return;
    }

    alert("Booking created successfully!");
    navigate("/my-bookings");
  } catch (error) {
    console.error("Booking error:", error);
    alert("Could not connect to the server. Please try again.");
  } finally {
    setIsSubmitting(false);
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

        <span className="eyebrow">BOOK A SERVICE</span>

        <h1>Let's fix it.</h1>

        <p className="auth-description">
          Tell us what you need, and we'll help you get started.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="service">Choose a service</label>
          <select
            id="service"
            value={service}
            onChange={(event) => setService(event.target.value)}
            required
          >
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="AC Repair">AC Repair</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Computer Repair">Computer Repair</option>
<option value="Tutoring">Tutoring</option>
          </select>

          <label htmlFor="address">Service address</label>
          <textarea
            id="address"
            placeholder="Enter your complete address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            rows={3}
            required
          />

          <label htmlFor="date">Preferred date</label>
          <input
            id="date"
            type="date"
            value={date}
            min={new Date().toLocaleDateString("en-CA")}
            onChange={(event) => setDate(event.target.value)}
            required
          />

          <label htmlFor="details">Additional details (optional)</label>
          <textarea
            id="details"
            placeholder="Describe the issue..."
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            rows={3}
          />

          <button
  type="submit"
  className="primary-button auth-submit"
  disabled={isSubmitting}
>
  {isSubmitting ? "Booking..." : "Submit Booking →"}
</button>
        </form>

        <Link className="back-home" to="/dashboard">
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}

export default Booking;
