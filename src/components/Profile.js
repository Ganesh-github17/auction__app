import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profile.css';

function Profile() {
  const [userProfile, setUserProfile] = useState({
    username: '',
    email: '',
    joinDate: '',
    auctionsWon: [],
    auctionsParticipated: [],
    auctionsCreated: []
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        window.location.href = '/signin';
        return;
      }

      try {
        const response = await axios.get('http://localhost:5001/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Ensure arrays exist in the response data
        const profileData = {
          ...response.data,
          auctionsWon: response.data.auctionsWon || [],
          auctionsParticipated: response.data.auctionsParticipated || [],
          auctionsCreated: response.data.auctionsCreated || []
        };
        setUserProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>User Profile</h2>
      </div>
      <div className="profile-grid">
        <div className="profile-card">
          <h3>Personal Information</h3>
          <ul>
            <li><strong>Username:</strong> {userProfile.username}</li>
            <li><strong>Email:</strong> {userProfile.email}</li>
            <li><strong>Member Since:</strong> {new Date(userProfile.joinDate).toLocaleDateString()}</li>
          </ul>
        </div>

        <div className="profile-card">
          <h3>Auction Statistics</h3>
          <div className="profile-stats">
            <div className="stat-card">
              <h4>Auctions Won</h4>
              <p>{userProfile.auctionsWon.length}</p>
            </div>
            <div className="stat-card">
              <h4>Participated</h4>
              <p>{userProfile.auctionsParticipated.length}</p>
            </div>
            <div className="stat-card">
              <h4>Created</h4>
              <p>{userProfile.auctionsCreated.length}</p>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <h3>Recent Wins</h3>
          <div className="recent-activity">
            {userProfile.auctionsWon.slice(0, 3).map((auction, index) => (
              <div key={index} className="activity-item">
                <strong>{auction.itemName}</strong>
                <span>Won at ${auction.winningBid}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-card">
          <h3>Active Bids</h3>
          <div className="recent-activity">
            {userProfile.auctionsParticipated
              .filter(auction => !auction.closed)
              .slice(0, 3)
              .map((auction, index) => (
                <div key={index} className="activity-item">
                  <strong>{auction.itemName}</strong>
                  <span>Current Bid: ${auction.currentBid}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;