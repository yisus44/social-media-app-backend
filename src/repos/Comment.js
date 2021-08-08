const pool = require('../database/pool');

class Comment {
  static async findCommentById(commentId) {
    const result = await pool.query(
      'SELECT * FROM post_comments WHERE id=$1;',
      [commentId]
    );
    const comment = result.rows[0];
    if (comment) {
      comment.createdAt = comment.created_at;
      comment.updatedAt = comment.updated_at;
    } else {
      throw new Error('Couldnt find what you are looking for');
    }
    return comment;
  }
  static async createComment(body, userId, postId, username) {
    const result = await pool.query(
      'INSERT INTO post_comments (body,user_id,post_id,username)VALUES($1,$2,$3,$4) RETURNING *',
      [body, userId, postId, username]
    );
    const comment = result.rows[0];
    if (comment) {
      comment.createdAt = comment.created_at;
      comment.updatedAt = comment.updated_at;
    } else {
      throw new Error('Couldnt find what you are looking for');
    }
    return comment;
  }

  static async deleteComment(commentId) {
    const result = await pool.query(
      'DELETE FROM post_comments WHERE id = $1 RETURNING *',
      [commentId]
    );
    const comment = result.rows[0];
    if (comment) {
      comment.createdAt = comment.created_at;
      comment.updatedAt = comment.updated_at;
    } else {
      throw new Error('Couldnt find what you are looking for');
    }

    return comment;
  }
}

module.exports = { Comment };
