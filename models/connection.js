const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
    userID: String,
    connectionID: String,
    name: String,
    host: String,
    topic: String,
    details: String,
    dateAndTime: String,
    location: String
});

const connection = mongoose.model('connection', connectionSchema);


module.exports = {
    connectionSchema,
    connection};
