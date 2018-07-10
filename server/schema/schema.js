const graphql = require('graphql');
const Post = require('../models/post.js');
const User = require('../models/user.js');
const Comment = require('../models/comment.js');
const Category = require('../models/category.js');
const Like = require('../models/like.js');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean
} = graphql;

// User Type

const userType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        token: { type: GraphQLString },
        password: { type: GraphQLString },
        posts: {
            type: new GraphQLList(postType),
            resolve(parent, args) {
                return Post.find({ authorId: parent.id });
            }
        }

    })
});

// Category Type

const categoryType = new GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
    })
});

// Post Type

const postType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        text: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        category: {
            type: categoryType,
            resolve(parent, args) {
                return Category.findById(parent.categoryId);
            }
        },
        author: {
            type: userType,
            resolve(parent, args) {
                return User.findById(parent.authorId);
            }
        }
    })
});

// Comment Type

const commentType = new GraphQLObjectType({
    name: 'comment',
    fields: () => ({
        id: { type: GraphQLID },
        text: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        post: {
            type: postType,
            resolve(parent, args) {
                return Post.findById(parent.postId)
            }
        },
        author: {
            type: userType,
            resolve(parent, args) {
                return User.findById(parent.authorId);
            }
        }
    })
});

// Like Type

const likeType = new GraphQLObjectType({
    name: 'like',
    fields: () => ({
        id: { type: GraphQLID },
        author: {
            type: userType,
            resolve(parent, args){
                return User.findById(parent.authorId);
            }
        },
        post: {
            type: postType,
            resolve(parent, args) {
                return Post.findById(parent.postId);
            }
        }
    })
});

// Root Query

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: userType,
            args: { id: { type: GraphQLID } },            
            resolve(parent, args) {
                return User.findById(args.id);
            }
        },
        category: {
            type: categoryType,
            args: { id: { type: GraphQLID } },            
            resolve(parent, args) {
                return Category.findById(args.id);
            }
        },
        post: {
            type: postType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Post.findById(args.id);
            }
        },
        comment: {
            type: commentType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Comment.findById(args.id);
            }
        },
        like: {
            type: likeType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Like.findById(args.id);
            }
        }
    }
});

// Mutations

const Mutations = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // Add a new User
        addUser: {
            type: userType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                username: { type: new GraphQLNonNull(GraphQLString)},
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: {  type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args) {
                let user = new User({
                    name: args.name,
                    username: args.username,
                    email: args.email,
                    password: args.password
                });
                // Save in the DataBase
                return user.save();
            }
        },
        addCategory: {
            type: categoryType,
            args: {
                name: { type: GraphQLString },
            },
            resolve(parent, args) {
                let category = new Category({
                    name: args.name
                });
                // Save in the DataBase
                return category.save();
            }
        },
        addPost: {
            type: postType,
            args: {
                title: { type: GraphQLString },
                text: { type: GraphQLString },
                categoryId: { type: GraphQLID },
                authorId: { type: GraphQLID },
                createdAt: { type: GraphQLString }
            },
            resolve(parent, args){
                let post = new Post({
                    title: args.title,
                    text: args.text,
                    categoryId: args.categoryId,
                    authorId: args.authorId,
                    createdAt: args.createdAt
                });
                return post.save();
            }
        },
        addComment: {
            type: commentType,
            args: {
                text: { type: new GraphQLNonNull(GraphQLString) },
                postId: { type: new GraphQLNonNull(GraphQLID) },
                authorId: { type: new GraphQLNonNull(GraphQLID) },
                createdAt: { type: GraphQLString},
            },
            resolve(parent, args){
                let comment = new Comment({
                    text: args.text,
                    postId: args.postId,
                    authorId: args.authorId,
                    createdAt: args.createdAt
                });
                return comment.save();
            }
        },
        addLike: {
            type: likeType,
            args: {
                authorId: { type: new GraphQLNonNull(GraphQLID) },
                postId: {  type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let like = new Like({
                    pressed: args.pressed,
                    authorId: args.authorId,
                    postId: args.postId
                });
                return like.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutations
});