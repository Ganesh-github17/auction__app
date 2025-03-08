import React from 'react';
import './AboutLearning.css';

function AboutAuction() {
  return (
    <div className="about-auction">
      <h2>About Our Auction Platform</h2>
      <div className="auction-description">
        <h3>Our Mission</h3>
        <p>
          We strive to create a transparent, efficient, and user-friendly auction platform that connects buyers 
          and sellers worldwide. Our goal is to revolutionize the traditional auction experience by leveraging 
          modern technology while maintaining the excitement and fairness of competitive bidding.
        </p>

        <div className="auction-types">
          <h3>Types of Auctions We Offer</h3>
          <ul>
            <li><strong>English Auction:</strong> The most common type where prices increase as buyers bid. Perfect for art, antiques, and collectibles.</li>
            <li><strong>Dutch Auction:</strong> Starts with a high price that decreases until someone bids. Ideal for time-sensitive sales.</li>
            <li><strong>Sealed-Bid Auction:</strong> Buyers submit secret bids, highest bid wins. Great for competitive business contracts.</li>
            <li><strong>Reverse Auction:</strong> Sellers compete to offer the lowest price to a buyer. Excellent for procurement and service contracts.</li>
          </ul>
        </div>

        <div className="auction-benefits">
          <h3>Why Choose Our Platform?</h3>
          <ul>
            <li><strong>Fair Market Value:</strong> Our competitive bidding system ensures items sell at their true market value</li>
            <li><strong>Secure Transactions:</strong> Advanced security measures protect your bids and personal information</li>
            <li><strong>Real-time Updates:</strong> Instant notifications keep you informed about your bids and auction status</li>
            <li><strong>Expert Support:</strong> Our dedicated team is available to assist you throughout the auction process</li>
          </ul>
        </div>

        <div className="auction-process">
          <h3>How It Works</h3>
          <ul>
            <li><strong>Register:</strong> Create your account to start participating in auctions</li>
            <li><strong>Browse:</strong> Explore our wide range of available items and upcoming auctions</li>
            <li><strong>Bid:</strong> Place your bids on items that interest you</li>
            <li><strong>Win:</strong> Successfully win auctions and complete secure transactions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AboutAuction;