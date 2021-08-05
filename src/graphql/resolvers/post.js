const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const auth = require('../../utils/auth');

const postResolvers = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(err);
      }
    },
    async getPost(parent, { postId }, context, info) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async createPost(parent, { body }, context, info) {
      const user = auth(context);
      if (body.trim() === '') {
        throw new Error('Post body must not be empty');
      }
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });
      const post = await newPost.save();
      return post;
    },
    async deletePost(parent, { postId }, context, info) {
      const user = auth(context);
      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return 'Post deleted succesfully';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async likePost(parent, { postId }, context) {
      const { username } = auth(context);
      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          //post already like,unlike it
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          //not liked,like post
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }
        await post.save();
        return post;
      } else {
        throw new UserInputError('Post not found');
      }
    },
  },
};

module.exports = postResolvers;
