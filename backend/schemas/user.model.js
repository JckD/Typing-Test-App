const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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
        default : Date(Date.now())
    },
    highWPMScore : {
        type : String,
        
    },
    highAccScore : {
        type : String,
    }
});


module.exports = mongoose.model("users" , UserSchema);