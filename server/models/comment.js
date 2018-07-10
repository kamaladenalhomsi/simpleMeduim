const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: String,
    postId: String,
    authorId: String, 
    createdAt: Date,
});

module.exports = mongoose.model('comment', commentSchema);