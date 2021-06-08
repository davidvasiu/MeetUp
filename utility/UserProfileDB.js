const user = require('../models/userProfile');
const connection = require('../models/connection');

const userProfileModel = user.user;
const connectionModel = connection.connection;

class UserProfileDB{

    async createConnection(userID, connectionID, name, host, topic, details, dateAndTime, location){
        var newConnection = new connectionModel({userID: userID, connectionID: connectionID, name: name, host: host, topic: topic, details: details, dateAndTime: dateAndTime, location: location});
        await newConnection.save();
        
    }

    async updateConnection(userID, connectionID, name, host, topic, details, dateAndTime, location){
        await connectionModel.updateOne({connectionID: connectionID}, {"$set": {userID: userID, connectionID: connectionID, name: name, host: host, topic: topic, details: details, dateAndTime: dateAndTime, location: location}});
    }

    get_userConnections(userID){
        return userProfileModel.find({userID: userID});
    }

    async add_userConnection(userID, connectionID, RSVP){
        var check_userConnectionList = await userProfileModel.find({userID: userID, connectionID: connectionID});
        if(check_userConnectionList.length == 0){
           var newUser = new userProfileModel({userID: userID, connectionID: connectionID, RSVP: RSVP});
           await newUser.save();
        }else if(check_userConnectionList.length == 1){
            //help with how to update a document in mongoose/mongoDB: https://stackoverflow.com/questions/25443883/set-a-value-with-mongoose-in-nodejs
            //this website gave me the idea of the update() function as well: https://stackoverflow.com/questions/7267102/how-do-i-update-upsert-a-document-in-mongoose
            await userProfileModel.updateOne({userID: userID, connectionID: connectionID}, {"$set": {RSVP: RSVP}});
        }else{
            console.log("Somthing went wrong adding a savedUserConnection")
        }
    }

    //used .deleteMany() function from my Exercise 8 assignment. 
    async remove_userConnection(userID, connectionID){
        await userProfileModel.deleteMany({userID: userID, connectionID: connectionID});
    }

    async delete_userConnections(){
        await userProfileModel.deleteMany();
    }
    
}

module.exports =  UserProfileDB;