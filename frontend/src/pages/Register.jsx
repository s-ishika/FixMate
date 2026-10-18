import { useState } from "react";
import "../index.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  
const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert("Account created successfully!");
    console.log(data);
  } catch (error) {
    console.error("Registration error:", error);
    alert("Unable to connect to the server.");
  }
};


  return (
    <div className="auth-page">
      <div className="auth-card">
        <a className="brand auth-brand" href="/">
          <span className="brand-icon">⌂</span>
          <span>
            Fix<span className="brand-highlight">Mate</span>
          </span>
        </a>

        <span className="eyebrow">WELCOME TO FIXMATE</span>

        <h1>Create your account</h1>

        <p className="auth-description">
          Find trusted professionals for your everyday needs.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />

          <button type="submit" className="primary-button auth-submit">
            Create Account →
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <a href="/login">Log in</a>
        </p>

        <a className="back-home" href="/">
          ← Back to home
        </a>
      </div>
    </div>
  );
}

export default Register;
