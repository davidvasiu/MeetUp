//This ulitity modules was created by following the Exercise 3 Sample Demonstration video as well as other resources off and on Canvas, including: (https://heynode.com/tutorial/readwrite-json-files-nodejs)
//Help with async/await functions: https://stackoverflow.com/questions/58672254/i-am-getting-promise-pending-when-using-mongoose-find-function
const connection = require('../models/connection');

const connectionModel = connection.connection;

class connectionDB{

    getConnections(){
       return connectionModel.find();
    }

    getConnection(connectionID){
       return connectionModel.find({connectionID: connectionID});
        
    }

    async getTopic(){
        var topic = [];
        var connectionList = [];
        
        connectionList = await connectionModel.find();
        for(var i=0; i<connectionList.length; i++){
            if(connectionList[i].topic && !(topic.includes(connectionList[i].topic))){
                topic.push(connectionList[i].topic);
            }
        }
        return topic;
    }

    async deleteConnection(connectionID){
        await connectionModel.deleteMany({connectionID: connectionID});
    }

    async deleteConnections(){
        await connectionModel.deleteMany();
    }

}

module.exports = connectionDB;