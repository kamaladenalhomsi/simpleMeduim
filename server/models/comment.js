const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: String,
    post: String,
    author: String, 
    createdAt: Date,
});

module.exports = mongoose.model('comment', commentSchema);