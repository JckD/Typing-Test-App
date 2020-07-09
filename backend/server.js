const express = require('express');
const app  = express();
const bodyParser = require('body-parser');
const cors = require ('cors');
const mongoose = require('mongoose');
const PORT = 8080;
const router = express.Router();


const { dbURI } = require('../config.json');


// Routes
const quoteRoutes = require('./routes/quoteRoutes');

app.use(cors({ credentials : true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());

mongoose.connect(dbURI, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

app.use('/Quotes', quoteRoutes);

app.listen(PORT, function() {
    console.log('Sever is running on Port: ' + PORT);

})