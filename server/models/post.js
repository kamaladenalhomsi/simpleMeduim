const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: String,
    text: String,
    categoryId: String,
    authorId: String,
    createdAt: Date,
});

module.exports = mongoose.model('post', postSchema);