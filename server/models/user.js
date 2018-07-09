const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    username: String,
    email: String,
    token: String,
    password: String,
});

module.exports = mongoose.model('User', userSchema);