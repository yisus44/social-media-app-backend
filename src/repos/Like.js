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
      'INSERT INTO post_likes (user_id,post_id,username)VALUES ($1, $2, $3) RETURNING *',
      [userId, postId, username]
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
  static async likeComment(userId, postId) {
    const result = await pool.query(
      'INSERT INTO comments_likes (user_id,post_id)VALUES ($1, $2) RETURNING *',
      [userId, postId]
    );
    return result.rows[0];
  }
  static async dislikeComment(userId, postId) {
    const result = await pool.query(
      'DELETE FROM comments_likes WHERE( user_id = $1 AND post_id = $2) RETURNING *',
      [userId, postId]
    );

    return result.rows;
  }
}

module.exports = { Like };
