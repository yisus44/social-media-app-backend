const pool = require('../database/pool');

class Post {
  static async addPostCommentsAndLikesToPost(post) {
    //TODO: Research if some of these queries can be made with joins
    const post_comments = await pool.query(
      'SELECT * FROM post_comments WHERE post_id = $1',
      [post.id]
    );
    const post_likes = await pool.query(
      'SELECT * FROM post_likes WHERE post_id = $1',
      [post.id]
    );
    post.username = post.user_id;

    post.comments = post_comments.rows;
    post.commentCount = post_comments.rows.length;

    post.likes = post_likes.rows;
    post.likesCount = post_likes.rows.length;

    post.createdAt = post.created_at;
    post.updatedAt = post.updated_at;
    return post;
  }
  static async findAll() {
    const posts = await pool.query(
      'SELECT * FROM posts ORDER BY updated_at DESC LIMIT 10'
    );
    for (let post of posts.rows) {
      await this.addPostCommentsAndLikesToPost(post);
    }
    return posts.rows;
  }

  static async findPostById(id, needExtraInfo = true) {
    const post = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (needExtraInfo) {
      await this.addPostCommentsAndLikesToPost(post.rows[0]);
    }
    return post.rows[0];
  }
  static async createPost(body, username, userId) {
    //body, the user_id and username of the authr
    const result = await pool.query(
      'INSERT INTO posts (body,username,user_id)VALUES ($1,$2,$3) RETURNING *',
      [body, username, userId]
    );

    const post = result.rows[0];
    post.comments = [];
    post.commentCount = 0;

    post.likes = [];
    post.likesCount = 0;

    post.createdAt = post.created_at;
    post.updatedAt = post.updated_at;
    return post;
  }

  static async deletePostById(id) {
    const result = await pool.query(
      'DELETE FROM posts WHERE id = $1 RETURNING *',
      [id]
    );

    return result.rows[0];
  }
}

module.exports = { Post };