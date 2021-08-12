const pool = require('../database/pool');

class Like {
  static async findByUserAndPost(userId, postId) {
    const result = await pool.query(
      'SELECT * FROM post_likes WHERE user_id = $1 AND post_id=$2',
      [userId, postId]
    );

    return result.rows[0];
  }

  static async likePost(userId, postId, username) {
    const result = await pool.query(
      'INSERT INTO post_likes (user_id,post_id,username, created_at)VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, postId, username, new Date().toISOString()]
    );
    return result.rows[0];
  }
  static async dislikePost(userId, postId) {
    const result = await pool.query(
      'DELETE FROM post_likes WHERE( user_id = $1 AND post_id = $2) RETURNING *',
      [userId, postId]
    );

    return result.rows;
  }

  static async findByUserAndComment(userId, comment_id) {
    const result = await pool.query(
      'SELECT * FROM comments_likes WHERE user_id = $1 AND comment_id=$2',
      [userId, comment_id]
    );

    return result.rows[0];
  }

  static async likeComment(userId, commentId, username) {
    const result = await pool.query(
      'INSERT INTO comments_likes (user_id,comment_id,username,created_at)VALUES ($1, $2, $3,$4) RETURNING *',
      [userId, commentId, username, new Date().toISOString()]
    );
    return result.rows[0];
  }
  static async dislikeComment(userId, commentId) {
    const result = await pool.query(
      'DELETE FROM comments_likes WHERE( user_id = $1 AND comment_id = $2) RETURNING *',
      [userId, commentId]
    );

    return result.rows;
  }
}

module.exports = { Like };
