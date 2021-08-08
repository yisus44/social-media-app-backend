const { AuthenticationError, UserInputError } = require('apollo-server');
const { Like } = require('../../repos/Like');

const { Post } = require('../../repos/Post');
// const Post = require('../../models/Post');
const auth = require('../../utils/auth');

const postResolvers = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.findAll();
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPost(parent, { postId }, context, info) {
      try {
        const post = await Post.findPostById(postId);
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
      const newPost = await Post.createPost(body, user.username, user.id);
      console.log(newPost);
      return newPost;
    },
    async deletePost(parent, { postId }, context, info) {
      const user = auth(context);
      try {
        const post = await Post.findPostById(postId, false);
        if (user.username === post.username) {
          await Post.deletePostById(postId);
          return 'Post deleted succesfully';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async likePost(parent, { postId }, context) {
      const { id: userId, username } = auth(context);
      console.log(userId);
      const post = await Post.findPostById(postId, false);
      if (post) {
        const hasBeenLiked = await Like.findByUserAndPost(userId, postId);
        if (hasBeenLiked) {
          Like.dislikePost(userId, postId);
        } else if (!hasBeenLiked) {
          Like.likePost(userId, postId, username);
        }
        const updatedPost = await Post.findPostById(postId);
        return updatedPost;
      } else {
        throw new UserInputError('Post not found');
      }
    },
  },
};

module.exports = postResolvers;
