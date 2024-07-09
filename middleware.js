const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require('./schema.js');
const ExpressError = require("./util/ExpressError.js");


// req.isAuthenticated()-->inbuilt method provided by passport --> returns true agr jo user ye form render krwana chahta hai --> vo logged in hai otherwise returns false


// jaise user loggedin nhi hai --> to uso login pge pr redirect krenge --> waha jb vo login krdega --> to "/listings" pr chla jayga --> and fir (add listings) pr click krke iss baar new listing create kr payga --> becoz this time (req.isAuthenticate() will return true)

// before login --> req.user = undefined
//  after login --> req.user = {
// _id: new ObjectId('6657186269065588afd394d7'),
//     email: 'chintu@gmail.com',
//         username: 'chintu',
//             __v: 0
// }

// yhi req.user --> req.isAuthenticated() ki help krti hai ye pta lgane me ki user loggedin hai ya nhi --> kyuki req.user current session ke user ki info store krke rkhti hai



// add this middleware in --> create newlisting route , edit listing route and update listing route

module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user);

    // req.path and req.originalUrl --> vo urls hai --> jaise hmne new listing create krne ke liye add listing click kra --> and agr hum loggedIn nhi hai --> to ("/login") pr redirect hogye --> to hamra ("/listing/new") wala page to gya --> agr ab hum login kr bhi dete hai --> tb bhi hum ("/listings") pr redirect horhe hai --> naki jispr hum initially hona chah rhe the --> to req.path stores relative path of that desired path and req.originalUrl stores the whole path of that desired url
    // example (req.path = /new) and (req.originalUrl = /listings/new)  
    // (req.path = /661bc640a2001d7d65beff84/edit ) and (req.originalUrl = / /listings/661bc640a2001d7d65beff84/edit?)

    // so we want login ke bad vo isi url pr redirect ho --> naki (/listings) pr
    // console.log(req.path, "..", req.originalUrl);
    if (!req.isAuthenticated()) {
        // agr user loggedIn nhi hai tbhi isko save krwane ki need hai wrna else part me nhi hai
        // ab koi bhi middleware is particular session ke lie redirectUrl var ko access kr skta hai
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be LoggedIn to create Listing!");
        res.redirect("/login");
    }
    else {
        next();
    }
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log(res.locals.redirectUrl);
        next();
    }
    else {
        next();
    }
}


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Please send Valid data for listing");
    // }
    // console.log(req.body.listing);
    let listing1 = await Listing.findById(id);
    // console.log(res.locals.currUser);
    if (!(listing1.owner.equals(res.locals.currUser._id))) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect("/listings");
    }
    else {
        next();
    }
}


module.exports.validateListing = (req, res, next) => {
    console.log("REQUEST BODY", req.body);
    let result = listingSchema.validate(req.body);
    console.log("RESULT", result);
    if (result.error) {
        next(new ExpressError(400, result.error));
    }
    else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let result = reviewSchema.validate(req.body);
    console.log(req.body);
    console.log(result);
    if (result.error) {
        next(new ExpressError(400, result.error));
    }
    else {
        next();
    }
}


// Important --> code me changes + save means --> server restart --> means new session --> therefore baar baar login krna pdega
// isi reason se sid baar baar change hoti hai  ---> even for same user and server 


module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review1 = await Review.findById(reviewId);
    // console.log(res.locals.currUser);
    if (!(review1.author.equals(res.locals.currUser._id))) {
        req.flash("error", "You are not the author of this Review!");
        return res.redirect(`/listings/${id}`);
    }
    else {
        next();
    }
}