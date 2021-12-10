//Help with async/await functions: https://stackoverflow.com/questions/58672254/i-am-getting-promise-pending-when-using-mongoose-find-function
var express = require('express');
var bodyParser = require('body-parser');
var connectionDB = require('../utility/connectionDB');
var userDB = require('../utility/UserDB');
var userProfileDB = require('../utility/UserProfileDB');

var connectDB = new connectionDB();
var userDBAccount = new userDB();
var new_userProfile = new userProfileDB();

var urlencodedParser = bodyParser.urlencoded({extended: false});

var userRouter = express.Router();
/*
I followed the Milestone 3 solution video to help with figuring out how to pass objects to the views using sessions.
Specifically at line 46 (var user = new userProfile(req.session.userObj.userID, req.session.userObj.connections);).
In order to pass the user object, I needed to create/update the userProfile using the constructor.
I saw the way the Milestone 3 solution video implemented it and used that in my solution (specifically line 46) to pass the user object through to the view. I also
used that same concept throughout this project.
Lastly, I saw that I could implement the connectionDB in this controller to access the connection(s) from the Milestone 3 solution video as well.
I then copied/used that code and idea to help me access the connections in this conntroller to pass into userConnection object. 
*/

//help with making session and using session.save() from here: https://www.youtube.com/watch?v=R2FbisgWclU
userRouter.post('/login', urlencodedParser, async function(req,res){
    //Checks to see if the submitted username and password matches with a user in the db
    var validateUser = await userDBAccount.checkUserCredentials(req.body.username, req.body.password);
    if(validateUser.length == 0 || (typeof validateUser[0] == 'undefined')){
        res.render('login');
    //If the username matches with a user in the db then run the following code
    }else{
        req.session.newUser = validateUser[0];
        req.session.save();
        var userID = req.session.newUser.userID;
        var connectionID = req.query.connectionID;
        await new_userProfile.remove_userConnection(userID, connectionID);
    
        var connectionList = [];
        var connectionListRSVP = [];
        var userProfileList = await new_userProfile.get_userConnections(userID);
        var connectionsList = await connectDB.getConnections();
        for (var i=0; i < userProfileList.length; i++){
           for(var j=0; j< connectionsList.length; j++){
               if(userProfileList[i].connectionID == connectionsList[j].connectionID){
                    connectionListRSVP.push(userProfileList[i].RSVP);
                    connectionList.push(connectionsList[j]);
               }
           }
        }
        res.render('myConnections', {connect: connectionList, rsvp: connectionListRSVP, user: req.session.newUser});
    } 
});

userRouter.get('', async function(req, res){
    if(!(req.session.newUser)){
        res.render('login');
    }else{
        var userID = req.session.newUser.userID;
        var connectionID = req.query.connectionID;
        await new_userProfile.remove_userConnection(userID, connectionID);
    
        var connectionList = [];
        var connectionListRSVP = [];
        var userProfileList = await new_userProfile.get_userConnections(userID);
        var connectionsList = await connectDB.getConnections();
        for (var i=0; i < userProfileList.length; i++){
           for(var j=0; j< connectionsList.length; j++){
               if(userProfileList[i].connectionID == connectionsList[j].connectionID){
                    connectionListRSVP.push(userProfileList[i].RSVP);
                    connectionList.push(connectionsList[j]);
               }
           }
        }
    
        res.render('myConnections', {connect: connectionList, rsvp: connectionListRSVP, user: req.session.newUser});
    }
});


userRouter.get('/addConnection', async function(req, res){
    if(!(req.session.newUser)){
        res.render('login');
    }else{
        var userID = req.session.newUser.userID;
        var connectionID = req.query.connectionID;
        var RSVP = req.query.rsvp;

        await new_userProfile.add_userConnection(userID, connectionID, RSVP);
        
        var connectionList = [];
        var connectionListRSVP = [];
        var userProfileList = await new_userProfile.get_userConnections(userID);
        var connectionsList = await connectDB.getConnections();
        for (var i=0; i < userProfileList.length; i++){
        for(var j=0; j< connectionsList.length; j++){
            if(userProfileList[i].connectionID == connectionsList[j].connectionID){
                    connectionListRSVP.push(userProfileList[i].RSVP);
                    connectionList.push(connectionsList[j]);
            }
        }
        }
        res.render('myConnections', {connect: connectionList, rsvp: connectionListRSVP, user: req.session.newUser});
    }
});

userRouter.get('/delete', async function(req, res){
    if(!(req.session.newUser)){
        res.render('login');
    }else{
        var userID = req.session.newUser.userID;
        var connectionID = req.query.connectionID;
        await new_userProfile.remove_userConnection(userID, connectionID);

        var connectionList = [];
        var connectionListRSVP = [];
        var userProfileList = await new_userProfile.get_userConnections(userID);
        var connectionsList = await connectDB.getConnections();
        for (var i=0; i < userProfileList.length; i++){
            for(var j=0; j< connectionsList.length; j++){
                if(userProfileList[i].connectionID == connectionsList[j].connectionID){
                        connectionListRSVP.push(userProfileList[i].RSVP);
                        connectionList.push(connectionsList[j]);
                }
            }
        }

        res.render('myConnections', {connect: connectionList, rsvp: connectionListRSVP, user: req.session.newUser});
    }
});

userRouter.get('/deleteConnection', async function(req, res){
    if(!(req.session.newUser)){
        res.render('login');
    }else{
        await connectDB.deleteConnection(req.query.connectionID);
        res.render('connections', {connection: await connectDB.getConnections(), topic: await connectDB.getTopic(), user: req.session.newUser});
    }
});

//help with closing/ destroying (session.destroy()) from here: https://www.youtube.com/watch?v=R2FbisgWclU
userRouter.get('/signOut', async function(req, res){
    if(!(req.session.newUser)){
        res.render('login');
    }else{
        //await new_userProfile.delete_userConnections();
        await req.session.destroy();
        res.render('index'); 
    }
});

userRouter.get('/*', async function(req, res){
    if(!(req.session.newUser)){
        res.render('login');
    }else{
        var userID = req.session.newUser.userID;
        var connectionID = req.query.connectionID;
        await new_userProfile.remove_userConnection(userID, connectionID);
    
        var connectionList = [];
        var connectionListRSVP = [];
        var userProfileList = await new_userProfile.get_userConnections(userID);
        var connectionsList = await connectDB.getConnections();
        for (var i=0; i < userProfileList.length; i++){
           for(var j=0; j< connectionsList.length; j++){
               if(userProfileList[i].connectionID == connectionsList[j].connectionID){
                    connectionListRSVP.push(userProfileList[i].RSVP);
                    connectionList.push(connectionsList[j]);
               }
           }
        }
    
        res.render('myConnections', {connect: connectionList, rsvp: connectionListRSVP, user: req.session.newUser});
    }
});

module.exports = userRouter;
