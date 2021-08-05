const { UserInputError, AuthenticationError } = require('apollo-server');

const Post = require('../../models/Post');
const auth = require('../../utils/auth');

const commentResolver = {
  Mutation: {
    async createComment(parent, { postId, body }, context, info) {
      const { username } = auth(context);
      if (body.trim() === '') {
        throw new UserInputError('Empty comment', {
          errors: { body: 'Comment body must not be empty' },
        });
      }
      const post = await Post.findById(postId);

      if (post) {
        //TODO: refactor to make a table for comments
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else {
        throw new UserInputError('Post not found');
      }
    },
    async deleteComment(parent, { postId, commentId }, context, info) {
      const { username } = auth(context);
      const post = await Post.findById(postId);
      try {
        if (post) {
          const commentIndex = post.comments.findIndex(
            (c) => c.id === commentId
          );
          if (post.comments[commentIndex].username === username) {
            post.comments.splice(commentIndex, 1);
            await post.save();
            console.log(post);
            return post;
          } else {
            throw new AuthenticationError('Action not allowed');
          }
        } else {
          throw new UserInputError('Post not found');
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};

module.exports = commentResolver;
