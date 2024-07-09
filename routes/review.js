const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../util/wrapAsync.js");
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware.js');
const reviewController = require("../controllers/reviews.js");




// Creating Reviews:
// 1) setting up reviews form
// 2) submitting the form --> adding review to database
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


// Delete Review route
// $pull operator --> which removes from an existing array all instances of a value or values that match a specified condition
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router;
