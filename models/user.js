const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userID: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String
});

const user = mongoose.model('user', userSchema);

module.exports = {
    userSchema,
    user
};