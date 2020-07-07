const express = require("express");
const QuoteRoutes = express.Router();

let Quote = require('../schemas/quote.model');

//Route that returns all quotes
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


// Ruote that returns one book that matches the requested id
QuoteRoutes.get('/:id', async (req, res) => {
    let id = req.params.id
    try {
        let quote = await Quote.findById(id);
        res.send(quote);
    } catch (err) {
        console.log(err);
    }
})

// Route that find's a quote by its id and updates it with the
// contents of the body of the request
QuoteRoutes.post('/update/:id', async (req, res) => {
    Quote.findById(req.params.id, function(err, quote) {
        if (!quote) {
            res.status(404).send("No quotes matching that id");
        }
        else {
            quote.quoteTitle = req.body.quoteTitle;
            quote.quoteBody = req.body.quoteBody;
            quote.quoteAuthor = req.body.quoteAuthor;
            quote.quoteUser = req.body.quoteUser;

            quote.save().then(quote => {
                res.json("Quote Updated!");
            })
            .catch(err => {
                res.status(400).send("Quote not updated :(");
            });
        }
    });
});

// Route that adds a quote to the database with the body of the request
// containing the data for the quote 
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