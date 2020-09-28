const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let QuoteSchema = new Schema({
    quoteTitle: {
        type: String
    },
    quoteBody: {
        type: String
    },
    quoteAuthor: {
        type: String
    },
    quoteUser: {
        type: String
    },
    quoteScore: {
        type : Number,
        default : 0,
        required : true
    },
    quoteApproved : {
        type : Boolean,
        default : false,
        required : true
    },
    highWPMScore : {
        type : String,
        default : 0,
        required : true
        
    },
    highAccScore : {
        type : String,
        default : 0,
        required : true
    },
})

module.exports = mongoose.model('Quote', QuoteSchema);