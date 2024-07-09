const { required } = require('joi');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);

//--> automatically username ,password ke lie salting and hashing implement krdega  --> also ye hmare Schema ke andr kuch methods bhi add krdeta hai  
// (https://github.com/saintedlama/passport-local-mongoose#api-documentation)


const User = mongoose.model('User', userSchema);
module.exports = User;


// You're free to define your User how you like. Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.

// Additionally, Passport - Local Mongoose adds some methods to your Schema.See the API