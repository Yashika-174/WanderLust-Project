const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const { userSchema } = require('../schema.js');
const User = require("../models/user.js");
const passport = require("passport");
const { func } = require("joi");
const { saveRedirectUrl } = require('../middleware.js');

const userController = require("../controllers/users.js");

// Agr username --> already registered usernames se unique nhi hoga to error ayga --> username already registered

router.route("/signup")
    .get(wrapAsync(userController.renderSignupForm))
    .post(wrapAsync(userController.signup));


// passport.authenticate(strategy,options) --> middleware which will authenticate the request
// {failureRedirect:"/login"}  --> agr jo user ne username and password enter kra hai vo db me exist nhi krta to us case me kaha pr redirect krna hai --> in our case we want to redirect to '/login'
// failureFlash: true --> mtlb agr user exist nhi krta hoga db me (either user entered wrong username or password  ) so in that case we are going to flash a message --> error message ye khud show krdega  (flash form me --> hme req.flash() likhne ki need nhi)

//  agr login successful hogya means passport.authenticate ne agr "/login" pr redirect nhi kra --> tb hmara async callback run krega wrna nhi


router.route("/login")
    .get(wrapAsync(userController.renderLoginForm))
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), wrapAsync(userController.login));


router.get("/logout", userController.logout);


module.exports = router;