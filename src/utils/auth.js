const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');

function auth(context) {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];
    if (token) {
      try {
        console.log();
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return user;
      } catch (error) {
        console.log(error);
        throw new AuthenticationError('Invalid/Expired token');
      }
    }
  }
  throw new Error('Unauthorized');
}

module.exports = auth;
