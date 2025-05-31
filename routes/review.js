const express = require("express");
// to get access to req.params from parent router
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../joiSchema.js");
const {
  validateReview,
  isLoggedIn,
  isreviewAuthor,
} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// Reviews
// create review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// delete review
router.delete("/:reviewId", isLoggedIn, isreviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
