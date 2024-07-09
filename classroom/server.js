const express = require("express");
const app = express();
const port = 3000;
const session = require("express-session");
const flash = require('connect-flash');
const path = require("path");
const { func } = require("joi");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.listen(port, function () {
    console.log(`app is listening on port ${port}`);
})


const sessionOptions = { secret: "mysupersecretstring", resave: false, saveUninitialized: true };
app.use(session(sessionOptions));
// to flash ko use krne ke lie sessions ko use krna compulsory hai
app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_message = req.flash("success");
    res.locals.error_message = req.flash("error");
    next()
})


// app.get("/test", function (req, res) {
//     res.send("Test sucessfull!");
// })


// ab hr baar req bhejne pr count bdhta jayga and uska track jaa rha hai ki kitni baar us route pr ye req bheji gyi
app.get("/reqcount", function (req, res) {
    if (req.session.count) {
        req.session.count++;
    }
    else {
        req.session.count = 1;
    }
    res.send(`You sent a request ${req.session.count} times`);
})

// alg alg tabs of same browser pr bhi vhi count continue hoga --> req.session.count 1 se restart nhi hoga
// req.session ek single session ko track krta hai
// usi ke andr hmne apna count variable bna lia

// session means (client and server same rhta hai --> unhi ke beech req and res aate jate rhte hai)

// one thing to notice--> agr ye normal req-res cycle hoti --> to us hisaab se same req pr same hi response milta
// in statless protocols --> agr req same hai to generlly resp bhi same hi hota hai


// but in case of stateful protocols --> kai baar req same hone pr bhi --> due to presence of diff states --> hamara response change hojata hai

// abhi to hmara count ek temporary storage me store ho rha hai --> kyuki jaise hi tabs bnd krke khole --> count 1 se reinitialize hota hai

// Warning The default server - side session storage, MemoryStore, is purposely not designed for a production environment.It will leak memory under most conditions, does not scale past a single process, and is meant for debugging and developing.

// project has two stages : development (jb ek hi comp pr project ko design krte hue run kre ) and production (jb dusre log hmari website ko actually me use kre)

// so in production stage we cannot use Memorystore : temporary stores jo well known dbs pr based hai --> (https://www.npmjs.com/package/express-session#compatible-session-stores)

// redis based session store is mostly used
// but since abhi hum development phase me hai so we will use only MemoryStorage which is JS based storage


// req.flash() ke andr two parameters pass kie jate hai --> 1)key 2)message
app.get("/register", function (req, res) {
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    console.log(req.session);
    if (name === "anonymous") {
        req.flash("error", "user not registered!");
    }
    else {
        req.flash("success", "User Registered successfully!");
    }
    console.log(req.session);
    //can be this-->Session {
    //     cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true },
    //     flash: { success: ['User Registered successfully!'] },
    //     name: 'yashika'
    // }

    // or this -->Session {
    //     cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true },
    //     flash: { error: ['user not registered!'] },
    //     name: 'anonymous'
    // }


    res.redirect("/hello");
})


// By default req.session ye hota hai:-
// req.session contains --> Session {
// cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true }
// }

// and name key dalne ke baad
// req.session contains --> Session {
// cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true },
// name='yashika'
// }


app.get("/hello", function (req, res) {
    // let { name = "anonymous" } = req.query;
    const name = req.session.name;
    // res.send(`Hello, ${name}`);
    // console.log(req.flash("success"));  //-->[ 'User Registered successfully!' ]
    // const msg = req.flash("success");
    // console.log(msg);
    // console.log(req.flash("success"));  //prints empty array --> kyuki key="success" ki value ko ek baar access kiya ja chuka hai
    // console.log(msg); --> ye hum kitni bhi baari kr skte hai --> yaha hum req.flash() ka use krke key ki value ko access nhi kr rhe kyuki --> msg var ke andr ab key ki value already store ho chuki hai
    // res.render("page.ejs", { name, msg })
    // res.render("page.ejs", { name, msg })

    res.render("page.ejs", { name });
})


// IMPORTANT
// here (/register,/hello) both are for same client and server --> therefore ONE SINGLE SESSION --> isley hi req.session.name (defined in /register route) ko hum (/hello route me use) kr paye

// (/register route) me hmne req.flash() for key="success" hmne define kiya and (/hello route) pr hum use key ki value ko access kr paarhe hai --> kyuki dono ek hi session me hai

// ek time pr ek hi msg (k-v)pair req.flash() ke paas rhta hai
// agr req.flash("koi bhi key","koi bhi msg");
// fir req.flash(); kr dia
// to uppr (k-v)pair ko express bhul jaega
// and console.log(req.flash("for that key")) --> empty array print hogi

// Code of server.js me zra sa bhi change krne pr session terminate hojata hai--> fir same client and server ko new sid milti hai
