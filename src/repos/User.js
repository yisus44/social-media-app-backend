const pool = require('../database/pool');

class User {
  static async createUser(email, username, password) {
    try {
      const result = await pool.query(
        'INSERT INTO users (email,username,password, created_at)VALUES($1,$2,$3,$4) RETURNING *',
        [email, username, password, new Date().toISOString()]
      );

      return result.rows[0];
    } catch (error) {
      return error;
    }
  }

  static async findByUsername(username) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      return result.rows[0];
    } catch (error) {
      return error;
    }
  }
  static async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [
        id,
      ]);
      return result.rows[0];
    } catch (error) {
      return error;
    }
  }

  static async updatePassword(newPassword, oldPassword) {
    try {
      const result = await pool.query(
        'UPDATE users SET password = $1 WHERE password = $2 RETURNING *',
        [newPassword, oldPassword]
      );

      return result.rows[0];
    } catch (error) {
      return error;
    }
  }

  static async deleteById(id) {
    try {
      const result = await pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING *',
        [id]
      );

      return result.rows[0];
    } catch (error) {
      return error;
    }
  }
}

module.exports = { User };
