import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

function Landing() {
  return (
    <div className="landing-container">
      <div className="hero-section">
        <h1>Welcome to the Auction Platform</h1>
        <p>Your trusted destination for online auctions</p>
      </div>
      
      <div className="features-section">
        <h2>Why Choose Our Platform?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Secure Bidding</h3>
            <p>Safe and transparent auction process</p>
          </div>
          <div className="feature-card">
            <h3>Wide Selection</h3>
            <p>Diverse range of items to bid on</p>
          </div>
          <div className="feature-card">
            <h3>Easy to Use</h3>
            <p>Simple and intuitive bidding interface</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Start?</h2>
        <div className="cta-buttons">
          <Link to="/signup" className="cta-button signup">Sign Up Now</Link>
          <Link to="/signin" className="cta-button signin">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;