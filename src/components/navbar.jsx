import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useState } from "react";

export default function Navbar() {
  const { currentUser, userData, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">Visa Consultant</div>

      <div
        className={`navbar-links ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
      >
        {!currentUser ? (
          <>
            <Link to="/">Home</Link>
            <button className="nav-btn" onClick={() => scrollToSection("about")}>
              About
            </button>
            <button className="nav-btn" onClick={() => scrollToSection("services")}>
              Services
            </button>
            <button className="nav-btn" onClick={() => scrollToSection("contact")}>
              Contact
            </button>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : userData?.role === "admin" ? (
          <>
            <Link to="/admin">Dashboard</Link>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/appointments/new">Add Appointment</Link>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </>
        )}
      </div>

      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
    </nav>
  );
}
