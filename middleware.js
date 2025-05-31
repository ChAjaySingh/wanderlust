const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./joiSchema.js");
const Listing = require("./models/listing");
const Review = require("./models/review.js");

// to check if listing data is valid as per joi schema
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// to check if review data is valid as per joi schema
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// check user logged in or not
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // original url
    req.session.originalUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a listing!");
    return res.redirect("/login");
  }
  next();
};

// save original url
module.exports.saveOriginalUrl = (req, res, next) => {
  if (req.session.originalUrl) {
    res.locals.originalUrl = req.session.originalUrl;
    delete req.session.originalUrl;
  } else if (req.session.dirLogin == "/login" || req.session.dirLogin == "/signup") {
    res.locals.originalUrl = "/listings";
    delete req.session.dirLogin;
  } else {
    res.locals.originalUrl = req.session.dirLogin;
    delete req.session.dirLogin;
  }

  next();
};

// check user is authorized to edit or delete the listing
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(req.user._id)) {
    req.flash(
      "error",
      "You do not have valid permission to change this listing!"
    );
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// check user is authorized to edit or delete the review
module.exports.isreviewAuthor = async (req, res, next) => {
  let { reviewId, id } = req.params;
  let review = await Review.findById(reviewId);
  if (!req.user._id.equals(review.author._id)) {
    req.flash(
      "error",
      "You do not have valid permission to change this review!"
    );
    return res.redirect(`/listings/${id}`);
  }
  next();
};
