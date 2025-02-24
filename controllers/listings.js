const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });




module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}


module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    console.log(listing);

    // mtlb agr listing null hai
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}


module.exports.createListing = async (req, res, next) => {
    // let { title, description, image, price, location, country } = req.body;
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Please send Valid data for listing");
    // }


    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send();


    let listing = req.body.listing;


    const newListing = new Listing(listing);

    // if (!newListing.title) {
    //     throw new ExpressError(400, "Title Missing!");
    // }

    // else if (!newListing.description) {
    //     throw new ExpressError(400, "Description Missing!");
    // }

    // else if (!newListing.price) {
    //     throw new ExpressError(400, "Price Missing!");
    // }

    // else if (!newListing.location) {
    //     throw new ExpressError(400, "Location Missing!");
    // }

    // else if (!newListing.country) {
    //     throw new ExpressError(400, "Country Missing!");
    // }

    // else if (!newListing.image) {
    //     throw new ExpressError(400, "Image Missing!");
    // }
    console.log(req.user);
    newListing.owner = req.user._id;
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        newListing.image = { url, filename };
    }

    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings")
}


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    else {
        let originalImageUrl = listing.image.url;
        originalImageUrl.replace("/upload", "/upload/h_300,w_250")
        res.render("listings/edit.ejs", { listing, originalImageUrl });
    }
}


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    // yaha se req.body wala kaam to update hojayga --> lekin req.file wala update nhi hoga
    let updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // req.file wala kaam yaha update kiya hai
    if (typeof req.file != "undefined") {
        let filename = req.file.filename;
        let url = req.file.path;
        updatedListing.image = { url, filename };
        updatedListing.save();

    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");

    res.redirect("/listings");
}