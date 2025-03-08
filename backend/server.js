const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
//server is being configured to handle json
app.use(express.json());
//cors will help server to accept requests from multiple domains
app.use(cors());

const SECRET_KEY = 'my_super_secret_123!';

// In-memory data store
const TEST_AUCTIONS = [
  {
    id: '1',
    itemName: 'Vintage Watch',
    description: 'A beautiful antique timepiece',
    currentBid: 100,
    startingBid: 100,
    highestBidder: '',
    imageUrl: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=500',
    startTime: new Date(Date.now() + 1 * 60 * 1000),
    closingTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isClosed: false,
    isStarted: false,
    winner: ''
  },
  {
    id: '2',
    itemName: 'Art Painting',
    description: 'Original oil painting',
    currentBid: 500,
    startingBid: 500,
    highestBidder: '',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500',
    startTime: new Date(Date.now() + 2 * 60 * 1000),
    closingTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
    isClosed: false,
    isStarted: false,
    winner: ''
  }
];

let nextAuctionId = 3;

// Middleware to verify token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });
    req.user = user;
    next();
  });
};

// Signup Route called when signup form is submitted on the frontend
app.post('/Signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) 
    {
      return res.status(400).json({ message: 'Username already exists' });
    }

    //const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password });
    await newUser.save();//a new user is being created in db

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Signin Route
// Test credentials
const TEST_CREDENTIALS = [
  { username: 'testuser1', password: 'test123', id: '1' },
  { username: 'admin', password: 'admin123', id: '2' }
];

app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  
  // Check against test credentials
  const user = TEST_CREDENTIALS.find(u => u.username === username && u.password === password);
  
  if (user) {
    const token = jwt.sign({ userId: user.id, username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Signin successful', token });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});
// app.post('/Signin', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username, password });
//     if (user) {
//       const token = jwt.sign({ userId: user._id, username }, SECRET_KEY, { expiresIn: '1h' });
//       res.json({ message: 'Signin successful', token });
//     }
//     else {
//       res.status(400).json({ message: 'Invalid credentials' });
//     }
//   } catch (error) {
//     console.error('Signin Error:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// Create Auction Item (Protected)
app.post('/auction', authenticate, async (req, res) => {
  try {
    const { itemName, description, startingBid, closingTime } = req.body;

    if (!itemName || !description || !startingBid || !closingTime) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newItem = {
      id: String(nextAuctionId++),
      itemName,
      description,
      currentBid: startingBid,
      startingBid,
      highestBidder: '',
      closingTime: new Date(closingTime),
      isClosed: false
    };

    TEST_AUCTIONS.push(newItem);
    res.status(201).json({ message: 'Auction item created', item: newItem });
  } catch (error) {
    console.error('Auction Post Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all auction items
app.get('/auctions', async (req, res) => {
  try {
    res.json(TEST_AUCTIONS);
  } catch (error) {
    console.error('Fetching Auctions Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get a single auction item by ID
app.get('/auctions/:id', async (req, res) => {
  try {
    const auctionItem = TEST_AUCTIONS.find(item => item.id === req.params.id);
    if (!auctionItem) 
      return res.status(404).json({ message: 'Auction not found' });

    res.json(auctionItem);
  } catch (error) {
    console.error('Fetching Auction Item Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Function to check and update auction status
const checkAuctionStatus = (auction) => {
  const now = new Date();
  const start = new Date(auction.startTime);
  const end = new Date(auction.closingTime);

  if (now >= start && !auction.isStarted) {
    auction.isStarted = true;
    return { status: 'started', countdown: 3 };
  }

  if (now >= end && !auction.isClosed) {
    auction.isClosed = true;
    auction.winner = auction.highestBidder || 'No winner';
    return { status: 'ended', winner: auction.winner };
  }

  return { status: 'active' };
};

// Get auction status
app.get('/auctions/:id/status', async (req, res) => {
  try {
    const auctionItem = TEST_AUCTIONS.find(item => item.id === req.params.id);
    if (!auctionItem) return res.status(404).json({ message: 'Auction not found' });

    const status = checkAuctionStatus(auctionItem);
    res.json({ ...status, auction: auctionItem });
  } catch (error) {
    console.error('Auction Status Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update bid route to include status check
app.post('/bid/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { bid } = req.body;
    const item = TEST_AUCTIONS.find(item => item.id === id);

    if (!item) return res.status(404).json({ message: 'Auction item not found' });
    
    const status = checkAuctionStatus(item);
    if (status.status === 'ended') {
      return res.status(400).json({ message: 'Auction is closed', winner: item.winner });
    }
    if (status.status !== 'started') {
      return res.status(400).json({ message: 'Auction has not started yet' });
    }

    if (bid > item.currentBid) {
      item.currentBid = bid;
      item.highestBidder = req.user.username;
      res.json({ message: 'Bid successful', item, status });
    } else {
      res.status(400).json({ message: 'Bid too low' });
    }
  } catch (error) {
    console.error('Bidding Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Learning Center Routes

// Get user profile
app.get('/profile', authenticate, async (req, res) => {
  try {
    // Since we're using test credentials, find the user from TEST_CREDENTIALS
    const user = TEST_CREDENTIALS.find(u => u.id === req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all learning resources
app.get('/learning-resources', async (req, res) => {
  try {
    const resources = await LearningResource.find();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching learning resources' });
  }
});

// Add a new learning resource
app.post('/learning-resources', authenticate, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const resource = new LearningResource({ title, content, category });
    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Error creating learning resource' });
  }
});

// Get all quizzes
app.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quizzes' });
  }
});

// Submit quiz score
app.post('/quiz-scores', authenticate, async (req, res) => {
  try {
    const { quizId, score } = req.body;
    const user = await User.findById(req.user.userId);
    user.quizScores.push({ quizId, score });
    await user.save();
    res.json({ message: 'Quiz score saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving quiz score' });
  }
});

// Start the server
app.listen(5001, () => {
  console.log('Server is running on port 5001');
});
