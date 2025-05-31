const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  let {category} = req.query;
  if(category){
    const filteredListings = await Listing.find({category});
    return res.render("./listings.ejs", {allListings: filteredListings});
  }
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {

  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  // nested population
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing Not Found!");
    return res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);

    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = {url, filename};

    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created Successfully!");
    res.redirect("/listings");
  };

  module.exports.renderEditForm = async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id);
      if (!listing) {
        req.flash("error", "Listing Not Found!");
        return res.redirect("/listings");
      }

      let previewOgImg = listing.image.url.replace("/upload", "/upload/c_fill,w_200");
      res.render("./listings/edit.ejs", { listing, previewOgImg });
    };

    module.exports.updateListing = async (req, res) => {
        let { id } = req.params;
        
        let listing = await Listing.findByIdAndUpdate(id, req.body.listing);

        if(req.file){
          let url = req.file.path;
          let filename = req.file.filename;
          listing.image = {url, filename};
        }

        req.flash("success", "Listing Updated Successfully!");
        res.redirect(`/listings/${id}`);
      };

      module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
  };