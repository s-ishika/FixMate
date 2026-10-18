import "./index.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const services = [
  { icon: "🔧", name: "Plumbing", description: "Repairs and installations" },
  { icon: "⚡", name: "Electrical", description: "Safe electrical services" },
  { icon: "🧹", name: "Home Cleaning", description: "A fresh, clean home" },
  { icon: "❄️", name: "AC & Appliances", description: "Repair and maintenance" },
  { icon: "💻", name: "Computer Repair", description: "Laptop and PC support" },
  { icon: "📚", name: "Tutoring", description: "Learn from skilled tutors" },
];

function App() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  
  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoadingBookings(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setBookings([]);
          return;
        }

        const data = await response.json();

        if (response.ok) {
          setBookings(data.bookings || []);
        }
      } catch (error) {
        console.error("Could not fetch bookings:", error);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []);


  return (
    <div className="app">
      <header className="navbar">
       <Link className="brand" to="/">
          <span className="brand-icon">⌂</span>
          <span>Fix<span className="brand-highlight">Mate</span></span>
       </Link>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#how-it-works">How It Works</a>
        </nav>

        <div className="nav-actions">
          <Link className="login-button" to="/login">
  Log In
</Link>
          
          <Link className="primary-button" to="/register">
  Get Started ↗
</Link>
</div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">✦ YOUR HOME, IN GOOD HANDS</span>

            <h1>
              Trusted help for
              <br />
              <span>everyday living.</span>
            </h1>

            <p className="hero-description">
              Find reliable professionals for your home.
              Book a service, choose your time, and let
              FixMate take care of the rest.
            </p>

            <form className="search-bar" onSubmit={(event) => event.preventDefault()}>
              <span>⌕</span>
             <input
  id="serviceSearch"
  type="text"
  placeholder="What service do you need?"
  aria-label="Search services"
/>
              <button
  type="button"
  className="primary-button"
  onClick={() => {
    const searchValue = document
      .getElementById("serviceSearch")
      .value.trim()
      .toLowerCase();

    const matchedService = services.find((service) =>
      service.name.toLowerCase().includes(searchValue)
    );

    if (!searchValue) {
      alert("Please enter a service name.");
    } else if (matchedService) {
      const serviceValue =
        matchedService.name === "Home Cleaning"
          ? "Cleaning"
          : matchedService.name === "AC & Appliances"
          ? "AC Repair"
          : matchedService.name;

      navigate(`/booking?service=${encodeURIComponent(serviceValue)}`);
    } else {
      alert("Service not found. Try Plumbing, Electrical, Home Cleaning, AC & Appliances, Computer Repair, or Tutoring.");
    }
  }}
>
  Find a Pro →
</button>
            </form>

            <div className="trust-note">
              <span>✓ Trusted professionals</span>
              <span>✓ Easy booking</span>
              <span>✓ Convenient scheduling</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-circle">
              <div className="house-icon">⌂</div>
              <div className="tool-icon">🔧</div>
              <span className="floating-card">✦ Quality service, every time</span>
            </div>
            <div className="visual-caption">
              <span className="caption-dot" />
              Your neighborhood service partner
            </div>
          </div>
        </section>

<section className="my-bookings-section" id="my-bookings">
  <div className="section-heading">
    <span className="eyebrow">YOUR BOOKINGS</span>
    <h2>Manage Your Bookings</h2>
    <p>View your booked services and track their status.</p>
  </div>

  <Link className="primary-button" to="/my-bookings">
    View My Bookings →
  </Link>
</section>

        

        <section className="services-section" id="services">
          <div className="section-heading">
            <div>
              <span className="eyebrow">HERE WHEN YOU NEED US</span>
              <h2>What can we help with?</h2>
              <p>Find the right expert for your next task.</p>
            </div>
            <a className="view-all" href="#services">
              Explore services ↗
            </a>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.name}>
                <div className="service-icon">{service.icon}</div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              <Link
  to={`/booking?service=${
    service.name === "Home Cleaning"
      ? "Cleaning"
      : service.name === "AC & Appliances"
      ? "AC Repair"
      : service.name
  }`}
>
  Explore service ↗
</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <span className="eyebrow">SIMPLE FROM START TO FINISH</span>
          <h2>Getting things done, made easy.</h2>

          <div className="steps-grid">
            <article className="step-card">
              <span className="step-number">01</span>
              <h3>Choose a service</h3>
              <p>Find the service that matches your needs.</p>
            </article>
            <article className="step-card">
              <span className="step-number">02</span>
              <h3>Pick your professional</h3>
              <p>Compare available providers and pricing.</p>
            </article>
            <article className="step-card">
              <span className="step-number">03</span>
              <h3>Book with confidence</h3>
              <p>Choose a convenient time for your service.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#home">
          <span>Fix<span className="brand-highlight">Mate</span></span>
        </a>
        <p>More than just a service, it's your peace of mind.</p>
        <span>© 2026 FixMate</span>
      </footer>
    </div>
  );
}

export default App;