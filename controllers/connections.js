//Help from previous assignments and their files, for example: Exercise 3, and other Canvas assignments.
//Help with async/await functions: https://stackoverflow.com/questions/58672254/i-am-getting-promise-pending-when-using-mongoose-find-function
var express = require('express');
var connectionRouter = express.Router();
var bodyParser = require('body-parser');
var connectionDB = require('../utility/connectionDB');
var connectDB = new connectionDB();

var urlencodedParser = bodyParser.urlencoded({extended: false});

connectionRouter.get('/', async function(req, res){
    if(Object.keys(req.query).length == 0){
        res.render('connections', {connection: await connectDB.getConnections(), topic: await connectDB.getTopic(), user: req.session.newUser}); 
    }
    else if(connectDB.getConnection(req.query.connectionID)){
        res.render('connection', {connection: await connectDB.getConnection(req.query.connectionID), user: req.session.newUser});
    }
    else{
        res.render('connections', {connection: await connectDB.getConnections(), topic: await connectDB.getTopic(), user: req.session.newUser});
    }
});

//Checks to see if the inputed connectionID matches a connetion from database via .getConnection(req.params.connectionID), if it does not exist it is redirected to the connections page.
//If the connection exists, the page displays the connection page with information about that connection.
connectionRouter.get('/:connectionID', async function(req, res){
    var connectionCheck = await connectDB.getConnection(req.params.connectionID);
    if(req.session.newUser && !(connectionCheck.length == 0)){
        if(connectionCheck[0].userID == req.session.newUser.userID){
            var edit = "yes";
        }
    }
    if(!(connectionCheck.length == 0)){
        res.render('connection', {connection: await connectDB.getConnection(req.params.connectionID), user: req.session.newUser, edit: edit});
    }
    else{
        res.render('connections', {connection: await connectDB.getConnections(), topic: await connectDB.getTopic(), user: req.session.newUser});
    }
});

connectionRouter.get('/*', async function(req, res){
    res.render('connections', {connection: await connectDB.getConnections(), topic: await connectDB.getTopic(), user: req.session.newUser});
});

module.exports = connectionRouter