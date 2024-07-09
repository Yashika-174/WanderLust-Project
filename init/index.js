const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

main().then(function () {
    console.log("Connection Successful with MongoDB");
})
    .catch(function (err) {
        console.log(err);
    });

const initDB = async function () {
    await Listing.deleteMany({});
    // map function array ke andr changes nhi krta --> ye ek new array create krta hai and uske andr desired changes krta hai --> isley initData ke andr new(with changes wali) array store krani pdegi
    // initData.data is an array of objects(listings)
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "6657186269065588afd394d7" }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();

