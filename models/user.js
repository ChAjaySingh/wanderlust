const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// automatically add username and password fields
// and hash the password and save it to the database
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);