const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: String,
    text: String,
    categoryName: String,
    authorId: String,
    createdAt: Date,
    image: String
});

module.exports = mongoose.model('post', postSchema);