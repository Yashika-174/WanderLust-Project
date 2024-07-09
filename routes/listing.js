const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");


// add this middleware in --> create newlisting route , edit listing route and update listing route
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');



// hr jgh app ki jgh --> router likh denge --> app.get() is now --> router.get()


const listingController = require("../controllers/listings.js");

// Multer is a node.js middleware for handling multipart / form - data, which is primarily used for uploading files.It is written on top of busboy for maximum efficiency.

//NOTE: Multer will not process any form which is not multipart(multipart / form - data).

// to parse form data --> we will use multer
const multer = require('multer')

const { storage } = require("../cloudConfig.js");

// multer will take out files from the data and upload them on uploads folder
const upload = multer({ storage })


// INDEX ROUTE
// 1) get req on (/listings)--> return all listings

// Agr jaise kisi user ne --> hopscotch se post request bhejdi without any listing obj in req body --> means parameters me kuch fill hi nhi kia hoppscotch se--> to error ana chahiye --> pr agr hum khud error throw nhi krenge to -->  Empty document to save nhi hoga but hmara desired error nhi ayga --> Error 500 ayga -->But we want (Error 400:Bad Request) aye
// Therefore: if condition is required here




// mtlb jb validateListing next() ko call lgayga --> tbhi wrapAsync call hoga (next non-error handling middleware for same path (/listings)) --> wrna error throw krega apna


// yaha isLoggedIn middleware isley add kiya --> kyuki hoksta bina (new listing ka form) render krke hi koi new listing ki info post krne ki koshish kr rha ho --> hoppscotch ya postman jaisi services se --> so we have verify there also --> ki user loggedIn hai ya nhi

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

// to upload single file --> from posted data --> listing[image][url] --> in uploads folder
// .post(upload.single('listing[image][url]'), function (req, res) {

// contains file related data
// res.send(req.file);
// ab routes folder me ek uploads naam ka folder bn jaega automatically as soon as we create new listing --> jisme uploded image saved hogi in different format 
// will print :
// {
// "fieldname": "listing[image][url]",
// "originalname": "Untitled.png",
// "encoding": "7bit",
// "mimetype": "image/png",
// "destination": "uploads/",
// "filename": "d020ac6b5981a6cc461d939262b34568",
// "path": "uploads\\d020ac6b5981a6cc461d939262b34568",
// "size": 1152522
// }
// });



// CREATE : NEW AND CREATE ROUTE
// 1) button to add new place --> GET REQ --> (/listings/new) --> we will get a form --> to add new place
// 2)when we will submit this form --> post req--> on (/listings)

// IMPORTANT
// is route ko ("/:id") ke uppr rkhna hoga  --> wrna (new ko id ki trh treat )krke error mil skta
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));


// READ : SHOW ROUTE

// { ...req.body.listing } --> deconstructing listing object
// yaha isLoggedIn middleware isley add kiya --> kyuki hoksta bina (edit listing ka form) render krke hi koi updated listing ki info post krne ki koshish kr rha ho --> hoppscotch ya postman jaisi services se --> so we have verify there also --> ki user loggedIn hai ya nhi


// DELETE ROUTE
// 1) Delete req --> (listings/:id)

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .patch(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));



// UPDATE : EDIT AND UPDATE ROUTE
// 1) EDIT BUTTON --> GET REQ --> (/listings/:id/edit) --> get an edit form
// 2) fill that form --> submit--> patch req --> (/listings/:id)


router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;