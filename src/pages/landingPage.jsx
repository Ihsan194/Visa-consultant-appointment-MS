import React from "react";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";
import { Button } from "antd";
import Navbar from "../components/Navbar";


export default function LandingPage() {
  const { currentUser } = useAuth();

  return (
    <div className="page">
      <Navbar />
      <section className="hero">
        <div className="hero-content">
          <h1>Your Trusted Visa Consultant</h1>
          <p>Seamless appointment scheduling for quick visa approvals.</p>
          {currentUser ? (
            <Link to="/dashboard">
              <Button type="primary" size="large">Go to Dashboard</Button>
            </Link>
          ) : (
            <Link to="/signup">
              <Button type="primary" size="large">Book Appointment</Button>
            </Link>
          )}
        </div>
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1529070538774-1843cb3265df"
            alt="Visa Consultation"
          />
        </div>
      </section>

      <section id="about" className="section">
        
        <h2>About Us</h2>
        <p>
          We are a professional visa consultancy service helping individuals and families
          with fast and reliable visa appointments. Our mission is to simplify the
          process and provide expert guidance for your travels.
        </p>
      </section>

      <section id="services" className="section">
        <h2>Our Services</h2>
        <div className="cards">
          <div className="card"><h3>Student Visa</h3><p>Guidance for securing international study opportunities with ease.</p></div>
          <div className="card"><h3>Work Visa</h3><p>Fast-track your career abroad with smooth appointment scheduling.</p></div>
          <div className="card"><h3>Travel Visa</h3><p>Plan your vacations confidently with our hassle-free visa assistance.</p></div>
        </div>
      </section>

      <section id="contact" className="section contact">
        <h2>Contact Us</h2>
        <p>Email: ihsanalijamali22@gmail.com | Phone: +92 318 2163194</p>
        <Button type="primary" size="large">Get in Touch</Button>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} VisaConsult. All rights reserved.</p>
      </footer>
    </div>
  );
}
