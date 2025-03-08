import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './postauction.css';

function PostAuction() {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [startingBid, setStartingBid] = useState(0);
  const [closingTime, setClosingTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/signin');
    }
  }, [navigate]);

  const handlePostAuction = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You must be signed in to post an auction.');
      navigate('/signin');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5001/auction',
        { itemName, description, startingBid, closingTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Auction item posted successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post auction. Please try again.');
    }
  };

  return (
    <div className="post-auction-container">
      <h2>Post New Auction</h2>
      <form className="post-auction-form" onSubmit={handlePostAuction}>
        <div className="form-group">
          <label htmlFor="itemName">Item Name</label>
          <input
            id="itemName"
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Item Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="startingBid">Starting Bid ($)</label>
          <input
            id="startingBid"
            type="number"
            min="0"
            step="0.01"
            value={startingBid}
            onChange={(e) => setStartingBid(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="closingTime">Auction End Time</label>
          <input
            id="closingTime"
            type="datetime-local"
            value={closingTime}
            onChange={(e) => setClosingTime(e.target.value)}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit" className="submit-button">
          Post Auction
        </button>
      </form>
    </div>
  );
}

export default PostAuction;