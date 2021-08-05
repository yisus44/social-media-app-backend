const validator = require('validator');

function validateRegisterInput(username, email, password, confirmPassword) {
  const errors = {};
  if (username.trim() === '') {
    errors.username = 'Username must not be empty';
  }

  if (email.trim() === '') {
    errors.email = 'Email must not be empty';
  } else if (!validator.isEmail(email)) {
    errors.email = 'Email not valid';
  }

  if (password === '') {
    errors.password = 'Password must not be empty';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Password must match';
  }

  return {
    errors,
    isValid: Object.keys(errors).length < 1,
  };
}
function validateLoginInput(username, password) {
  const errors = {};
  if (username.trim() === '') {
    errors.username = 'Username must not be empty';
  }

  if (password.trim() === '') {
    errors.password = 'Password must not be empty';
  }
  return {
    errors,
    isValid: Object.keys(errors).length < 1,
  };
}

module.exports = {
  validateRegisterInput,
  validateLoginInput,
};
