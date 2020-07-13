const mongoose = require('mongoose');

const Schema = mongoos.Schema;

let UserSchema = new Schema({
    userName : {
        type: String,
        required : true
    },
    userEmail : {
        type : String,
        required : true
    },
    userPassword : {
        type : String,
        required : true
    },
    signUpDate : {
        type : String,
        default : Date.now
    }
});


module.exports = mongoose.model("users" , UserSchema);