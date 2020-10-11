const express = require("express");
const QuoteRoutes = express.Router();
const jwt = require("jsonwebtoken");
const verify = require('./verifyToken');

let Quote = require('../schemas/quote.model');
const { useCallback } = require("react");


//Route that returns all quotes
QuoteRoutes.route('/').get(function(req, res){
    Quote.find(function(err, quotes){
        if (err) {
            console.log(err);
        }else {
            res.json(quotes);
        }
    });
});

// Get a random quote
QuoteRoutes.get('/random', async (req, res) => {
    try {
        let count = await Quote.countDocuments()
        let rand = Math.floor(Math.random() * count)
        let randomQuote = await Quote.findOne({ quoteApproved : true}).skip(rand)
        res.send(randomQuote);
    } catch (err) {
        console.log(err);
    }
})

QuoteRoutes.get('/unapproved', verify , async(req, res) =>{

    await Quote.find({ quoteApproved : false },function(err, quotes){
        if (err)
        {
            res.send(err)
        } else {
            res.json(quotes);
        }
    })
})

QuoteRoutes.get('/approved', async(req, res) =>{

    Quote.find({ quoteApproved : true },function(err, quotes){
        if (err)
        {
            res.send(err)
        } else {
            res.json(quotes);
        }
    })
})

QuoteRoutes.post('/approve', verify, async(req, res) =>{
    //console.log(req.body)
    await Quote.findOneAndUpdate({ _id : req.body._id}, { quoteApproved : true}, function(err, quotes) {
        if(err) {
            res.send(err)
        } else {
            res.send(quotes)
        }
    })

})

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
QuoteRoutes.post('/update', verify,  async (req, res) => {
    const {
        quoteTitle,
        quoteBody,
        quoteAuthor,
        _id
    } = req.body

    Quote.findByIdAndUpdate(_id,
                        { quoteTitle : quoteTitle , 
                          quoteBody : quoteBody,
                          quoteAuthor : quoteAuthor,
                        },
                        function(err, result) {
                            if (err) {
                                res.send(err);
                            } else {
                                res.send(result)
                            }
                        }
    );

    
});

// Route that adds a quote to the database with the body of the request
// containing the data for the quote 
QuoteRoutes.post('/add', verify , async(req, res) => {
    quote = new Quote(req.body);
    //console.log(quote)

    try {
        await quote.save()
        res.send(quote.id)
    } catch(err) {
        res.status(500).send('Error saving quote')
    }
    
   
});

module.exports = QuoteRoutes;