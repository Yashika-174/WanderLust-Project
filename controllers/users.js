const User = require("../models/user.js");

module.exports.renderSignupForm = async (req, res) => {
    res.render("users/signup.ejs");
}


module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, function (err) {
            if (err) {
                // waise to err nchi ayga --> but agr passport khud hi login krane me fail hogya --> tb error aaskta hai
                // calling the error handling middleware --> joki error ko red box me treeke se print krwa deta hai
                next(err);
            }
            else {
                req.flash("success", "Welcome to WanderLust");
                res.redirect("/listings");
            }
        })
    }
    catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}


module.exports.renderLoginForm = async (req, res) => {
    res.render("users/login.ejs")
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to WanderLust, You are LoggedIn!");

    // lekin passport ek dikkt krta hai--> jaise hi user logged in hojata hai --> passport fir req.session ko renew krdeta hai --> to mtlb uske andr req.session.redirectUrl ye var exist nhi krega fir --> so it will be empty undefined value

    // so instead of saving redirectUrl in session object as a (k-v)pair --> hum locals me redirectUrl ko save krayge --> and passport has no access to delete this var from locals;
    // console.log(res.locals);
    if (res.locals.redirectUrl) {
        res.redirect(res.locals.redirectUrl);
    }

    // mtlb agr hum ("/listings") se direclty login pr click kr rhe hai--> to hmara isLoggedIn wala mw to run krega hi nhi--> means koi redirectUrl hi nhi hoga locals ke paas --> isley us case me we have to redirect to ("/listings")
    else {
        res.redirect("/listings");
    }
}


module.exports.logout = (req, res, next) => {
    console.log(res.locals);
    req.logout(function (err) {
        if (err) {
            // waise to err nchi ayga --> but agr passport khud hi logout krane me fail hogya --> tb error aaskta hai
            // calling the error handling middleware --> joki error ko red box me treeke se print krwa deta hai

            next(err);
        }
        else {
            req.flash("success", "You are logged Out Now!");
            res.redirect("/listings");
        }
    })
}