const express = require("express");
const QuoteRoutes = express.Router();

let Quote = require('../schemas/quote.model');

QuoteRoutes.route('/').get(function(req, res){
    Quote.find(function(err, quotes){
        if (err) {
            console.log(err);
        }else {
            console.log(quotes)
            res.json(quotes);
        }
    });
});

QuoteRoutes.route('/add').post(function (req, res){
    let quote = new Quote(req.body);

    quote.save()
    .then(quote => {
        res.status(200).json({'quote' : 'quote added successfully!'});
    })
    .catch(err => {
        res.status(400).send('Failed to add new book');
    });
});

module.exports = QuoteRoutes;