import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const calculateTimeLeft = (startTime, closingTime) => {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const end = new Date(closingTime).getTime();

    if (now < start) {
      return { timeType: 'start', time: start - now };
    } else if (now < end) {
      return { timeType: 'end', time: end - now };
    }
    return { timeType: 'ended', time: 0 };
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5001/auctions');
        setItems(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      }
    };

    fetchItems();
    const interval = setInterval(fetchItems, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [navigate]);

  const formatTimeLeft = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  // 🔹 Handle Logout
  // const handleLogout = () => {
  //   localStorage.removeItem('authToken'); // Remove token
  //   navigate('/signin'); // Redirect to Sign In page
  // };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/signin');
  };

  return (
    <div className="auction-container">
      <div className="dashboard-header">
        <h2>Active Auctions</h2>
        <div className="dashboard-actions">
          <Link to="/post-auction" className="post-auction-button">
            <button className="bid-button">Post New Auction</button>
          </Link>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading auctions...</div>
      ) : (
        <div className="auction-grid">
          {items.map((item) => {
            const timeLeft = calculateTimeLeft(item.startTime, item.closingTime);
            const formattedTime = formatTimeLeft(timeLeft.time);
            
            return (
              <div key={item.id} className={`auction-card ${item.isClosed ? 'closed' : ''}`}>
                <Link to={`/auction/${item.id}`} className="auction-link">
                  <div className="auction-image">
                    <img src={item.imageUrl} alt={item.itemName} />
                  </div>
                  <h3>{item.itemName}</h3>
                  <div className="auction-info">
                    <p>{item.description}</p>
                    <p className="current-bid">Current Bid: ${item.currentBid.toLocaleString()}</p>
                    <p>Highest Bidder: {item.highestBidder || 'No bids yet'}</p>
                    
                    {timeLeft.timeType === 'start' && (
                      <div className="status-badge waiting">Starts in {formattedTime}</div>
                    )}
                    {timeLeft.timeType === 'end' && (
                      <div className="status-badge active">Ends in {formattedTime}</div>
                    )}
                    {timeLeft.timeType === 'ended' && (
                      <div className="status-badge closed">
                        Auction Ended
                        {item.winner && <p>Winner: {item.winner}</p>}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
