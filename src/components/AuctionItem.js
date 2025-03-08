import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './auction.css';

function AuctionItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState({});
  const [bid, setBid] = useState(0);
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchItem = async () => {
      try {
        const [itemRes, statusRes] = await Promise.all([
          axios.get(`http://localhost:5001/auctions/${id}`),
          axios.get(`http://localhost:5001/auctions/${id}/status`)
        ]);
        setItem({ ...itemRes.data, ...statusRes.data });
        
        if (statusRes.data.status === 'started' && statusRes.data.countdown) {
          setMessage(`Auction starting in ${statusRes.data.countdown}...`);
        } else if (statusRes.data.status === 'ended') {
          setMessage(`Auction ended. Winner: ${statusRes.data.winner}`);
        }
      } catch (error) {
        setMessage('Error fetching auction item: ' + error.response?.data?.message || error.message);
        console.error(error);
      }
    };

    fetchItem();
    const interval = setInterval(fetchItem, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [id, navigate]);

  const handleBid = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setMessage('Please sign in to place a bid.');
      navigate('/signin');
      return;
    }

    if (bid <= item.currentBid) {
      setMessage('Bid must be higher than the current bid.');
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5001/bid/${id}`,
        { amount: bid },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      setMessage(res.data.message || 'Bid placed successfully!');
      // Refresh auction data after successful bid
      const [itemRes, statusRes] = await Promise.all([
        axios.get(`http://localhost:5001/auctions/${id}`),
        axios.get(`http://localhost:5001/auctions/${id}/status`)
      ]);
      setItem({ ...itemRes.data, ...statusRes.data });

      if (statusRes.data.status === 'ended') {
        setMessage(`Auction closed. Winner: ${statusRes.data.winner}`);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        setMessage('Authentication failed. Please sign in again.');
        navigate('/signin');
      } else {
        setMessage(error.response?.data?.message || 'Error placing bid. Please try again.');
      }
      console.error('Bid error:', error);
    }
  };

  useEffect(() => {
    if (item.closingTime) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const end = new Date(item.closingTime).getTime();
        const distance = end - now;

        if (distance < 0) {
          setTimeLeft('Auction Ended');
          clearInterval(timer);
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [item.closingTime]);

  return (
    <div className="auction-container">
      <div className="auction-card">
        <div className="timer">{timeLeft}</div>
        {item.status === 'ended' && <div className="winner-badge">Winner: {item.winner}</div>}
        {item.status === 'started' && item.countdown && (
          <div className="countdown-badge">Starting in {item.countdown}...</div>
        )}
        
        <h3>{item.itemName}</h3>
        <div className="auction-info">
          <p>{item.description}</p>
          <p className="current-bid">Current Bid: ${item.currentBid}</p>
          <p>Highest Bidder: {item.highestBidder || 'No bids yet'}</p>
        </div>

        {!item.isClosed && (
          <div className="bid-form">
            <input
              type="number"
              className="bid-input"
              value={bid}
              onChange={(e) => setBid(Number(e.target.value))}
              placeholder="Enter your bid"
              min={(item.currentBid || 0) + 1}
            />
            <button 
              className="bid-button"
              onClick={handleBid}
              disabled={bid <= item.currentBid}
            >
              Place Bid
            </button>
          </div>
        )}
        
        {message && (
          <p className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default AuctionItem;
