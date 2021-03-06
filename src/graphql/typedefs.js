const { gql } = require('apollo-server');

const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }

  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    password: String!
    createdAt: String!
  }

  type Comment {
    id: ID!
    createdAt: String
    username: String!
    body: String!
    likes: [Like]
    likeCount: Int
  }

  type Like {
    id: ID!
    createdAt: String
    username: String!
  }

  type Query {
    getPosts: [Post]
    getMostPopularPosts: [Post]
    getPost(postId: ID!): Post
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    updatePost(postId: ID!, body: String!): Post!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
    likeComment(commentId: ID!): Post!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
`;

module.exports = typeDefs;
