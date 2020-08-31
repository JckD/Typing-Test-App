const express = require('express');
const app  = express();
const bodyParser = require('body-parser');
const cors = require ('cors');
const path = require('path');
const mongoose = require('mongoose');
const PORT = 8080;
const router = express.Router();


//mongo db URI
const { dbURI } = require('../config.json');

// Routes
const quoteRoutes = require('./routes/quoteRoutes');

const CORSorigin = 'localhost:3000';
if ( process.env.NODE_ENV === 'development'){
  CORSorigin = 'localhost:8080'
}
app.use(cors({ credentials : true, origin: 'http://' + CORSorigin}));

//app.use(express.static(path.join(__dirname, '../build')))


app.use(bodyParser.json());

mongoose.connect(dbURI, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

app.use('/Quotes', quoteRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build','index.html'))
})

app.listen(PORT, function() {
    console.log('Sever is running on Port: ' + PORT);

})