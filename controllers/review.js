const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    // setting author to logged in user
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review Added Successfully!");
    res.redirect(`/listings/${listing._id}`);
  };

  module.exports.destroyReview = async (req, res, next) => {
    let { id, reviewId } = req.params;
    // removing objectId from reviews array in listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // removing review from reviews collection
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);
  };