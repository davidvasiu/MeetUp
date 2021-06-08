//Help from previous assignments and their files, for example: Exercise 3, and other Canvas assignments.
var express = require('express');
var newConnectionRouter = express.Router();
var bodyParser = require('body-parser');
var connectionDB = require('../utility/connectionDB');
var userProfile = require('../utility/UserProfileDB');

var connectDB = new connectionDB();
var new_userProfile = new userProfile();

var urlencodedParser = bodyParser.urlencoded({extended: false});

newConnectionRouter.get('/', function(req, res){
    if(!(req.session.newUser)){
        res.render('login');
    }else{
        res.render('newConnection', {user: req.session.newUser});
    }
});

newConnectionRouter.get('/edit', function(req, res){
    if(!(req.session.newUser)){
        res.render('login');
    }else{
        if(req.query.name){
            var newConnection_creation = [];
            //Help with push() command in JavaScript: https://www.w3schools.com/jsref/jsref_push.asp
            newConnection_creation.push(req.query.connectionID, req.query.name, req.query.topic, req.query.host, req.query.details, req.query.location, req.query.when);
            res.render('newConnection', {user: req.session.newUser, editConnection: newConnection_creation});
        }else{
            res.render('newConnection', {user: req.session.newUser});
        }
    }

});

//help with using post method from here: https://www.youtube.com/watch?v=rin7gb9kdpk
newConnectionRouter.post('/', urlencodedParser, async function(req, res){
    if(!(req.session.newUser)){
        res.render('login');
    }else{

    //Making logged user name (full name) to make the host for new conection made by the user
    var firstName = req.session.newUser.firstName;
    var lastName = req.session.newUser.lastName;
    var loggedUser_name = firstName + " " +  lastName;

    //Using the userID to attribute the new connection to the current user logged in
    var userID = req.session.newUser.userID;

    //Creating the new connection
    if(req.query.update){
        var place_holder = req.body.details;
        //Replacing \r\n when using textarea and pressing enter key. This is fixed by using the .replace() command. 
        //Some help with .replace() from here: https://stackoverflow.com/questions/7481099/regex-match-newline-in-textarea and https://stackoverflow.com/questions/4959501/dont-allow-new-lines-in-textarea and https://stackoverflow.com/questions/30593103/preserve-line-breaks-in-textarea
        desc = place_holder.replace(/\r\n/g, " ");

        await new_userProfile.updateConnection(userID, req.query.connectionID, req.body.name, req.body.host, req.body.topic, desc, req.body.when, req.body.where);
    }else{
        await new_userProfile.createConnection(userID, (Math.random()*100), req.body.name, loggedUser_name, req.body.topic, req.body.details, req.body.when, req.body.where);
    }
    res.render('connections', {connection: await connectDB.getConnections(), topic: await connectDB.getTopic(), user: req.session.newUser});  
    }
});

module.exports = newConnectionRouter