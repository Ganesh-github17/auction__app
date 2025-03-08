const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    currentBid: {
        type: Number,
        required: true
    },
    startingBid: {
        type: Number,
        required: true
    },
    highestBidder: {
        type: String,
        default: ''
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    closingTime: {
        type: Date,
        required: true
    },
    isClosed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bids: [{
        bidder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        amount: Number,
        time: {
            type: Date,
            default: Date.now
        }
    }]
});

// Method to check if auction is closed
auctionSchema.methods.checkIfClosed = function() {
    const now = new Date();
    if (now > this.closingTime && !this.isClosed) {
        this.isClosed = true;
        return true;
    }
    return false;
};

// Method to place a bid
auctionSchema.methods.placeBid = async function(userId, bidAmount) {
    if (this.isClosed) {
        throw new Error('Auction is closed');
    }
    
    if (bidAmount <= this.currentBid) {
        throw new Error('Bid amount must be higher than current bid');
    }

    this.currentBid = bidAmount;
    this.highestBidder = userId;
    this.bids.push({
        bidder: userId,
        amount: bidAmount
    });

    return this.save();
};

module.exports = mongoose.model('Auction', auctionSchema);