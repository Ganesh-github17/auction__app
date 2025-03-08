import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Dashboard from './components/Dashboard';
import AuctionItem from './components/AuctionItem';
import PostAuction from './components/PostAuction';
import AboutAuction from './components/AboutAuction';
import LearningCenter from './components/LearningCenter';
import Landing from './components/Landing';
import Profile from './components/Profile';
import Rules from './components/Rules';
import './App.css';

function App() {
  //isAuthenticated is the state, setIsAuthenticated changes the state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const navigate = useNavigate();

  //loads when the component load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    // navigate('/signin');
  };

  return (
    <Router>
      <div className="app">
        <header>
          <h1>Auction App</h1>
          <nav>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/signup" className="nav-link">Signup</Link>
            <Link to="/signin" className="nav-link">Signin</Link>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/post-auction" className="nav-link">Post Auction</Link>
            <Link to="/about" className="nav-link">About Auctions</Link>
            <Link to="/learning" className="nav-link">Learning Center</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <Link to="/rules" className="nav-link">Rules</Link>
            {isAuthenticated && (
              <button style={{ marginLeft: '10px', background: 'red', color: 'white' }} onClick={handleLogout} className="nav-link logout-button">Logout</button>
            )}
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auction/:id" element={<AuctionItem />} />
            <Route path="/post-auction" element={<PostAuction />} />
            <Route path="/about" element={<AboutAuction />} />
            <Route path="/learning" element={<LearningCenter />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/rules" element={<Rules />} />
          </Routes>
          
        </main>
        <footer>
          <p>&copy; 2024 Auction App. All rights reserved.</p>
          <p>Welcome to the best place to buy and sell items through auctions!</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
