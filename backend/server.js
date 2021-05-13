const express = require('express');
const app  = express();
const bodyParser = require('body-parser');
const cors = require ('cors');
const path = require('path');
const mongoose = require('mongoose');
const PORT = 8080;
const router = express.Router();
require('dotenv').config({ path: './.env'});


//mongo db URI
const { dbURI } = require('../config.json');
mongoose.set('useFindAndModify', false);
// Routes
const quoteRoutes = require('./routes/quoteRoutes');
const userRoutes = require('./routes/userRoutes');

let CORSorigin = 'localhost:3000';
if ( process.env.NODE_ENV === 'development'){
  CORSorigin = 'localhost:8080'
}
app.use(cors({ credentials : true, origin: 'http://' + CORSorigin}));

app.use(express.static(path.join(__dirname, '/build/')))
console.log(path.join(__dirname, '/build/'))

app.use(bodyParser.json());

mongoose.connect(process.env.DBURI, { useNewUrlParser: true,  useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

app.use('/Quotes', quoteRoutes);
app.use('/user', userRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build','index.html'))
})

app.listen(PORT, function() {
    console.log('Sever is running on Port: ' + PORT);
})