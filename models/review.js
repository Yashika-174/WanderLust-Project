const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;

// Every review is attached to exactly one listing
// One listing can have many reviews and one review can have only 1 listing(one to many relation)
// therefore each listing will contain (array of ObjectIds of their respective reviews)
