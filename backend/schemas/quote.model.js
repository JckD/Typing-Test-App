const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Quote = new Schema({
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
    }
})

module.exports = mongoose.model('Quote', Quote);