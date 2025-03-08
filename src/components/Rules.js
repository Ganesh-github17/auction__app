import React from 'react';
import './rules.css';

function Rules() {
  return (
    <div className="rules-container">
      <div className="rules-header">
        <h2>Auction Rules & Guidelines</h2>
      </div>
      <div className="rules-grid">
        <div className="rules-card">
          <h3>General Rules</h3>
          <ul>
            <li><strong>Registration Required</strong> All participants must register and verify their accounts before bidding</li>
            <li><strong>Binding Bids</strong> All bids are legally binding commitments to purchase</li>
            <li><strong>Minimum Increments</strong> Bids must meet minimum increment requirements</li>
            <li><strong>Payment Terms</strong> Winners must complete payment within 48 hours of auction end</li>
          </ul>
        </div>

        <div className="rules-card">
          <h3>Bidding Guidelines</h3>
          <ul>
            <li><strong>Bid Verification</strong> Ensure sufficient funds before placing bids</li>
            <li><strong>Retraction Policy</strong> Bids cannot be retracted once placed</li>
            <li><strong>Sniping Prevention</strong> Auctions extend by 5 minutes if bid placed in final minute</li>
            <li><strong>Multiple Bidding</strong> Participants can bid on multiple items simultaneously</li>
          </ul>
        </div>

        <div className="rules-card">
          <h3>Seller Responsibilities</h3>
          <ul>
            <li><strong>Accurate Descriptions</strong> Must provide accurate item descriptions and images</li>
            <li><strong>Shipping Timeline</strong> Items must be shipped within 5 business days</li>
            <li><strong>Communication</strong> Respond to buyer inquiries within 24 hours</li>
            <li><strong>Item Condition</strong> Disclose any defects or damages clearly</li>
          </ul>
        </div>

        <div className="rules-card">
          <h3>Dispute Resolution</h3>
          <ul>
            <li><strong>Reporting Issues</strong> Report problems within 48 hours of receiving item</li>
            <li><strong>Mediation Process</strong> Platform provides mediation for disputes</li>
            <li><strong>Refund Policy</strong> Clear guidelines for when refunds are issued</li>
            <li><strong>Feedback System</strong> Fair and honest feedback requirements</li>
          </ul>
        </div>

        <div className="rules-card">
          <h3>Prohibited Practices</h3>
          <ul>
            <li><strong>Shill Bidding</strong> Artificial price inflation is strictly prohibited</li>
            <li><strong>Fraud Prevention:</strong> Misrepresentation of items is not allowed</li>
            <li><strong>Communication:</strong> All transaction communication must be through platform</li>
            <li><strong>Account Sharing:</strong> Multiple accounts per user are not permitted</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Rules;