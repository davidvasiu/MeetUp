const user = require('../models/user');

userModel = user.user;

class UserDB{

    async getUser_by_firstName(userID){
        return await userModel.find({firstName: userID});
    }

    async checkUserCredentials(firstName, password){
        return await userModel.find({firstName: firstName, password: password});
    }

    async deleteUsers(){
        await userModel.deleteMany();
    }

}

module.exports =  UserDB;  