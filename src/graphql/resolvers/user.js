const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { User } = require('../../repos/User');
const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../utils/validators');

async function generateJWT(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

const userResolver = {
  Mutation: {
    async register(
      parent,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) {
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken',
          },
        });
      }
      const { isValid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!isValid) {
        throw new UserInputError('Errors', { errors });
      }

      password = await bcrypt.hash(password, 12);
      const newUser = await User.createUser(email, username, password);
      const token = generateJWT(newUser);

      return {
        ...newUser,
        createdAt: newUser.created_at,
        token,
      };
    },
    async login(parent, { username, password }, context, info) {
      const { errors, isValid } = validateLoginInput(username, password);
      const existingUser = await User.findByUsername(username);

      if (!isValid) {
        throw new UserInputError('Errors', { errors });
      }

      if (!existingUser) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, existingUser.password);
      if (!match) {
        throw new UserInputError('Bad Credentials', { errors });
      }

      const token = generateJWT(existingUser);
      return {
        ...existingUser,
        createdAt: existingUser.created_at,
        token,
      };
    },
  },
};

module.exports = userResolver;
