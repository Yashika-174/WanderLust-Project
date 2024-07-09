const mongoose = require('mongoose');
const Review = require("./review.js");



const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: false,
        default: "https://unsplash.com/photos/a-black-and-white-photo-of-a-man-sitting-at-a-desk-QhNQ9CXDmdw",
        set: function (v) {
            return (v === "" ? "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" : v);
        }
    },
    filename: {
        type: String,
    },
});


// We are assigning only one owner to each listing not array of owners

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image: imageSchema,
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"

    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true,
            default: [74.0541108203647, 15.3255560468503]
        }
    }
});


listingSchema.post("findOneAndDelete", async function (listing) {
    // this data is deleted document 
    // console.log(data);
    if (listing.reviews.length) {
        let res = await Review.deleteMany({ _id: { $in: listing.reviews } });
        console.log(res);

        // res will be { acknowledged: true, deletedCount: 2 }

    }
})


const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;