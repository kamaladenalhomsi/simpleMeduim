const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
    authorId: String,
    postId: String,
});

module.exports =  mongoose.model('like', likeSchema);