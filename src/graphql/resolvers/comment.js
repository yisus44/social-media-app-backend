const { UserInputError, AuthenticationError } = require('apollo-server');

//const Post = require('../../models/Post');
const auth = require('../../utils/auth');

const { Post } = require('../../repos/Post');
const { Comment } = require('../../repos/Comment');

const commentResolver = {
  Mutation: {
    async createComment(parent, { postId, body }, context, info) {
      const { id, username } = auth(context);
      if (body.trim() === '') {
        throw new UserInputError('Empty comment', {
          errors: { body: 'Comment body must not be empty' },
        });
      }
      const post = await Post.findPostById(postId, false);

      if (post) {
        //TODO: refactor to make a table for comments
        await Comment.createComment(body, id, postId, username);
        const updatedPost = await Post.findPostById(postId);
        return updatedPost;
      } else {
        throw new UserInputError('Post not found');
      }
    },
    async deleteComment(parent, { postId, commentId }, context, info) {
      const { id, username } = auth(context);
      const post = await Post.findPostById(postId);
      try {
        if (post) {
          const comment = await Comment.findCommentById(commentId);
          if (comment.username === username) {
            await Comment.deleteComment(commentId);
          } else {
            throw new AuthenticationError('Action not allowed');
          }
          const updatedPost = Post.findPostById(postId, true);
          return updatedPost;
        } else {
          throw new UserInputError('Post not found');
        }
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
  },
};

module.exports = commentResolver;
