//Help with learning how to remove/ drop a collection in mongoDB: https://docs.mongodb.com/manual/reference/method/db.collection.drop/
var express = require('express');
var connectionRouter = require('./controllers/connections.js');
var newConnectionRouter = require('./controllers/newConnection.js');
var userRouter = require('./controllers/userConntroller.js');
var session = require('express-session'); //help with sessions: https://www.youtube.com/watch?v=R2FbisgWclU
const mongoose = require('mongoose');
require('dotenv').config();
//process.env.DATABASE_URL
mongoose.connect('mongodb+srv://davidvasiu:1234abcd@cluster0.fihhz.mongodb.net/database?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
var app = express();

app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));

/*I found out that to use sessions accross the web application (MVC), I needed to put the session in the app.js file.
I learned this, from the Milestone 3 solution video, I saw the way she did it, and copied how the video did this part of the session implementation,
as in the location of the session creation.
*/
app.use(session({
    secret:"secret",
    resave: false,
    saveUninitialized: false,
}));

//Routes
app.get('/', function(req, res){
    res.render('index', {user: req.session.newUser});
});

app.get('/index', function(req, res){
    res.render('index', {user: req.session.newUser});
});

app.get('/about', function(req, res){
    res.render('about', {user: req.session.newUser});
});

app.get('/contact', function(req, res){
    res.render('contact', {user: req.session.newUser});
});

app.use('/connections', connectionRouter);

app.use('/connection', connectionRouter);

app.use('/myConnections', userRouter);

app.get('/login', function(req, res){
    if(!(req.session.newUser)){
        res.render('login');
    }else{
        res.render('index', {user: req.session.newUser})
    }
});

app.use('/newConnection', newConnectionRouter);

app.get('/*', function(req, res){
    res.render('index', {user: req.session.newUser});
});

app.listen(process.env.PORT || 8000);