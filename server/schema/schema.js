const graphql = require('graphql');
const Post = require('../models/post.js');
const User = require('../models/user.js');
const Comment = require('../models/comment.js');
const Category = require('../models/category.js');
const Like = require('../models/like.js');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
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
        status_code: { type: GraphQLString },
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
        posts: {
            type: new GraphQLList(postType),
            resolve(parent, args) {
                return Post.find({ categoryName: parent.name });
            }
        }
    })
});

// Post Type

const postType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        text: { type: GraphQLString },
        image: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        status_code: { type: GraphQLString },
        categoryName: { type: GraphQLString },
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
        forPost: { type: GraphQLBoolean },
        forComment: { type: GraphQLBoolean },
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
        },
        authors: {
            type: new GraphQLList(userType),
            resolve(parent, args) {
                return User.find();
            }
        },
        posts: {
            type: new GraphQLList(postType),
            resolve(parent, args) {
                return Post.find().sort({created_at: -1});
            }
        },
        comments: {
            type: new GraphQLList(commentType),
            resolve(parent, args) {
                return Comment.find();
            }
        },
        likes: {
            type: new GraphQLList(likeType),
            resolve(parent, args){
                return Like.find();
            }
        },
        categories: {
            type: new GraphQLList(categoryType),
            resolve(parent, args) {
                return Category.find();
            }
        },
        checkUser: {
          type: userType, 
          args: {
            username: { type: new GraphQLNonNull(GraphQLString) },
            email: { type: new GraphQLNonNull(GraphQLString) },
          },
          async resolve(parent, args){
            let user = await User.findOne({ username: args.username, email: args.email });
            if(user === null) {
              return {
                status_code: "Success"
              }
            }else {
              return {
                status_code: "Error"
              }
            }
          }
        },
        loginCheck: {
          type: userType,
          args: {
            email: { type: new GraphQLNonNull(GraphQLString) },
            password: { type: new GraphQLNonNull(GraphQLString) }
          },
          async resolve(parent, args) {
            let user = await User.findOne({ password: args.password, email: args.email });
            if(user === null) {
              return {
                status_code: "Error"
              }
            }else {
              // generate Token                
              let returnedToken = jwt.sign({user}, process.env.SESSION_SECRET );  
              return {
                status_code: "Success",
                token: returnedToken,
                id: user.id,
                name: user.name,
                username: user.username
              }
            }
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
            async resolve(parent, args) {
                let user = new User({
                    name: args.name,
                    username: args.username,
                    email: args.email,
                    password: args.password
                });
                // generate Token                
                let returnedToken = jwt.sign({user}, process.env.SESSION_SECRET );     
                // Save in the DataBase
                let userReturned = "";                                           
                function asyncCallSaveUser() {
                  return user.save().then(data => {
                    userReturned = data
                  });                  
                }             
                await asyncCallSaveUser();
                // Return
                return {
                  token: returnedToken,
                  name: userReturned.name,
                  username: userReturned.username,
                  email: userReturned.email,
                  password: userReturned.password,
                  id: userReturned.id
                };
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
                title: { type: new GraphQLNonNull(GraphQLString) },
                text: { type: new GraphQLNonNull(GraphQLString) },
                categoryName: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLString) },
                image: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args){
                let post = new Post({
                    title: args.title,
                    text: args.text,
                    categoryName: args.categoryName,
                    authorId: args.authorId,
                    image: args.image
                });
                let returnedPost = post.save();
                return returnedPost;
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
        editPost: {
          type: postType,
          args: {
              id: { type: GraphQLID },
              title: { type: GraphQLString },
              text: { type: GraphQLString },
              categoryName: { type: GraphQLString },
              image: { type: GraphQLString },
              oldImageName: { type: GraphQLString }
          },
          async resolve(parent, args) {
              let query = { "_id": args.id };
              const newPost = {
                  title: args.title,
                  text: args.text,
                  categoryName: args.categoryName,
                  oldImageName: args.oldImageName,
                  image: args.image
              };
              try {
              if(args.oldImageName !== "") {
                fs.unlink(`./static/uploads/images/${args.oldImageName}`, (err) => {
                  if(err) console.log(err);
                  console.log("DONE!");
                });
              }
              let returnedPost =  await Post.findOneAndUpdate(query, newPost);
              return {
                status_code: "Success",
                data: returnedPost
              }
              } catch (err) {
                console.log(err)
                return {
                  status_code: "Error"
                }
              }
          }
      },
      deletePost: {
        type: postType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve(parent, args) {
          let deletedPost = Post.findOneAndRemove({ _id: args.id})
          .exec(function(err, item) {
            if(err) {
              return {
                status_code: "Error"
              }
            }
            if (!item) {
              return {
                status_code: "Error"
              }
            }
            return {
              status_code: "Success"
            } 
          });
          console.log(deletedPost); 
          return deletedPost;
        }
      },
        addLike: {
            type: likeType,
            args: {
                authorId: { type: new GraphQLNonNull(GraphQLID) },
                postId: {  type: new GraphQLNonNull(GraphQLString)},
                forPost: { type: GraphQLBoolean },
                forComment: { type: GraphQLBoolean }
            },
            resolve(parent, args){
                let like = new Like({
                    forPost: args.forPost,
                    forComment: args.forComment,
                    authorId: args.authorId,
                    postId: args.postId
                });
                return like.save();
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutations
});