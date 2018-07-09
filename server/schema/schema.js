const graphql = require('graphql');
const Post = require('../models/post.js');
const User = require('../models/user.js');
const Comment = require('../models/comment.js');
const Category = require('../models/category.js');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
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
                return User.findById(parent.userId);
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
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutations
});