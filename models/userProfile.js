const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    userID: String,
    connectionID: String,
    RSVP: String
});

//help with mongoose db naming when trying to use the collection with mongoose model: https://ddcode.net/2019/05/12/why-does-mongoose-automatically-add-s-and-lowercase-when-creating-a-collection/
const user = mongoose.model('saveduserconnection', userProfileSchema);

module.exports = {
    userProfileSchema,
    user};